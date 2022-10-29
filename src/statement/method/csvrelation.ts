import * as assert from "../../assert.ts";
import type VM from "../../vm.ts";
import type Expr from "../expr/index.ts";

export default async function csvRelation(
	vm: VM,
	arg: Expr[],
): Promise<number> {
	const num = await arg[0].reduce(vm);
	assert.bigint(num, "1st argument of CSVRELATION must be an integer");
	const index = await arg[1].reduce(vm);
	assert.bigint(index, "2nd argument of CSVRELATION must be an integer");

	const character = vm.code.csv.character.get(Number(num));
	assert.cond(character != null, `Character #${num} does not exist`);

	return character.relation.get(Number(index)) ?? 0;
}
