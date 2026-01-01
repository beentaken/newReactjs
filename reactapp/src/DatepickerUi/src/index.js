import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
import TooltipExample from "./TooltipExample";
import PopupExample from "./PopupExample";
import DatePickerExample from "./DatePickerExample";

import D3 from "./D3";
import D5 from "./D5";
const rootElement = document.getElementById("root");
const root = createRoot(rootElement);

root.render(
  <StrictMode>
    <D5 />

    <PopupExample />
    <TooltipExample />

    <DatePickerExample />
    <D3 />
    <App />
  </StrictMode>
);
