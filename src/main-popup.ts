import { mount } from "svelte";
import "./app.css";
import Popup from "./Popup.svelte";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import "./theme";
import { storageChange } from "@/store";

await storageChange();

const bodyElement = document.querySelector("body");
// @ts-ignore
mount(Popup, { target: bodyElement });
