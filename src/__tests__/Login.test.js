import { render, screen } from "@testing-library/react";

import { customRender } from "../HelperLib/testSetup.js";

test("Login page rendered correctly", () => {
    render(customRender(["/login"]));
    //screen.debug();
    const loginDescription = screen.getByText(/Sign in using your email and password/i);
    expect(loginDescription).toBeInTheDocument();
})