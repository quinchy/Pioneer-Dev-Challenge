import { describe, it, expect, vi } from "vitest";
import { logger } from "./logger";

describe("logger", () => {
  it("should log info message", () => {
    const consoleSpy = vi.spyOn(console, "log").mockImplementation(() => {});
    logger.info("Test message", { key: "value" });
    expect(consoleSpy).toHaveBeenCalled();
    consoleSpy.mockRestore();
  });

  it("should log error message", () => {
    const consoleSpy = vi.spyOn(console, "error").mockImplementation(() => {});
    logger.error("Error occurred", { error: "test" });
    expect(consoleSpy).toHaveBeenCalled();
    consoleSpy.mockRestore();
  });

  it("should log warn message", () => {
    const consoleSpy = vi.spyOn(console, "warn").mockImplementation(() => {});
    logger.warn("Warning");
    expect(consoleSpy).toHaveBeenCalled();
    consoleSpy.mockRestore();
  });

  it("should log debug message", () => {
    const consoleSpy = vi.spyOn(console, "debug").mockImplementation(() => {});
    logger.debug("Debug info");
    expect(consoleSpy).toHaveBeenCalled();
    consoleSpy.mockRestore();
  });
});