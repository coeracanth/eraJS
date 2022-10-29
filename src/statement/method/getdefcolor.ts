import type VM from "../../vm.ts";
import type Expr from "../expr/index.ts";

export default function getDefColor(vm: VM, _arg: Expr[]): number {
	return parseInt(vm.printer.defaultColor, 16);
}
