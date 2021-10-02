import {assert, assertNumber} from "../../assert";
import type VM from "../../vm";
import type Expr from "../expr";

export default function csvMastername(vm: VM, arg: Expr[]): string {
	const num = arg[0].reduce(vm);
	assertNumber(num, "1st argument of CSVMASTERNAME must be an integer");

	const character = vm.code.data.character.get(num);
	assert(character != null, `Character #${num} does not exist`);

	return character.mastername;
}
