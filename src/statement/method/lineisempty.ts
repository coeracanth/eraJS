import type VM from "../../vm.ts";
import type Expr from "../expr/index.ts";

export default function lineIsEmpty(vm: VM, _arg: Expr[]): number {
	return vm.printer.chunks.length === 0 ? 1 : 0;
}
