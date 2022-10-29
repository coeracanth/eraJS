import type VM from "../../vm.ts";
import type Expr from "../expr/index.ts";

export default function getFocusColor(vm: VM, _arg: Expr[]): number {
	return parseInt(vm.printer.focus, 16);
}
