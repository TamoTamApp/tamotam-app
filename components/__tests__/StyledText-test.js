import React from "react";
import renderer from "react-test-renderer";

jest.mock("../../helpers/firebase", () => ({
  analytics: () => ({
    logEvent: () => undefined,
    logScreenView: () => Promise.resolve(),
  }),
  crashlytics: () => ({
    recordError: () => undefined,
  }),
}));

jest.mock("../../hooks/useColorScheme", () => () => "light");

import StyledText from "../StyledText";

it(`renders correctly`, () => {
  let root;
  renderer.act(() => {
    root = renderer.create(<StyledText>Snapshot test!</StyledText>);
  });

  expect(root.toJSON()).toMatchSnapshot();
});
