import { describe, expect, test } from "bun:test"
import { parseReleaseVersion } from "./updater-action"

describe("parseReleaseVersion", () => {
  test("accepts strict release version variants", () => {
    const valid = [
      "1.2.3",
      "v1.2.3",
      " 1.2.4\n",
      "1.2.3-alpha.1",
      "0.0.0-dev-17403.2",
      "0.0.0-next-17403",
      "0.0.0-beta-17404",
      "1.2.3+old",
      "v1.2.3+old",
      "9007199254740991.0.0",
      "1.0.0-9007199254740992",
      `1.2.4+${"a".repeat(250)}`,
    ]
    valid.forEach((version) => expect(parseReleaseVersion(version), version).toBeDefined())
  })

  test("parses release components", () => {
    const version = parseReleaseVersion("v1.2.3-alpha.1")
    expect(version?.major).toBe("1")
    expect(version?.core).toBe("1.2.3")
    expect(version?.prerelease).toEqual(["alpha", "1"])
  })

  test("preserves strict validity", () => {
    const invalid = [
      "=1.2.3",
      "V1.2.3",
      "1.2",
      "1.2.3.4",
      "01.2.3",
      "1.02.3",
      "1.2.03",
      "1.2.3-01",
      "1.2.3-",
      "1.2.3+",
      "1.2.3-alpha..1",
      "1.2.3_alpha",
      "9007199254740992.0.0",
      "0.9007199254740992.0",
      "0.0.9007199254740992",
    ]
    invalid.forEach((version) => expect(parseReleaseVersion(version), version).toBeUndefined())
  })

  test("rejects versions longer than the length limit before trimming", () => {
    expect(parseReleaseVersion(`${" ".repeat(251)}1.2.3`)).toBeDefined()
    expect(parseReleaseVersion(`${" ".repeat(252)}1.2.3`)).toBeUndefined()
  })
})
