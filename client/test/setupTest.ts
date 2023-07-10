// https://mayashavin.com/articles/test-react-components-with-vitest
// https://www.eternaldev.com/blog/testing-a-react-application-with-vitest/

import { expect } from "vitest";
import matchers from "@testing-library/jest-dom/matchers";

expect.extend(matchers);
