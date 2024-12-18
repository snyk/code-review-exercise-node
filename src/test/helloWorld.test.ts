import { sayHello } from "../service/helloWorld";

test("sayHello with name returns hello name", () => {
  const result = sayHello("World");

  expect(result).toEqual("Hello World");
});
