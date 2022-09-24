import { createRoot } from "react-dom/client";
import "./styles/index.scss";
import { App } from "./components/App/App";

const root = createRoot(document.getElementById("root"));

root.render(<App />);
