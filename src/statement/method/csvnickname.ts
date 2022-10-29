import * as assert from "../../assert.ts";
import type VM from "../../vm.ts";
import type Expr from "../expr/index.ts";

export default async function csvNickname(
	vm: VM,
	arg: Expr[],
): Promise<string> {
	const num = await arg[0].reduce(vm);
	assert.bigint(num, "1st argument of CSVNICKNAME must be an integer");

	const character = vm.code.csv.character.get(Number(num));
	assert.cond(character != null, `Character #${num} does not exist`);

	return character.nickname;
}
