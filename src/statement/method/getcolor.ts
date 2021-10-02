import * as color from "../../color";
import type VM from "../../vm";
import type Expr from "../expr";

export default function getColor(vm: VM, _arg: Expr[]): number {
	return color.toHex(vm.color.front);
}
