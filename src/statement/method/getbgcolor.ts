import type VM from "../../vm";
import type Expr from "../expr";

export default function getBgColor(vm: VM, _arg: Expr[]): number {
	return parseInt(vm.printer.background, 16);
}
