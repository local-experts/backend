import { cc } from "bun:ffi";
// @ts-expect-error
import source from "./number.c" with { type: "file" };

const randomRoute = () => {
const {
  symbols: { randomNumber },
} = cc({
  source,
  symbols: {
    randomNumber: {
      args: [],
      returns: "int",
    },
  },
});

return `Your random number is ${randomNumber()}!`
}

export default randomRoute
