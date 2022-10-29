import type VM from "../../vm.ts";
import type Expr from "../expr/index.ts";

export default function getColor(vm: VM, _arg: Expr[]): number {
	return parseInt(vm.printer.color, 16);
}
