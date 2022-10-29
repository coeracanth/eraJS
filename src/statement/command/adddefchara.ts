import * as assert from "../../assert.ts";
import Character from "../../character.ts";
import * as U from "../../parser/util.ts";
import Slice from "../../slice.ts";
import type VM from "../../vm.ts";
import Statement from "../index.ts";

const PARSER = U.arg0R0();
export default class AddDefChara extends Statement {
	public constructor(raw: Slice) {
		super(raw);

		U.tryParse(PARSER, raw);
	}

	// eslint-disable-next-line @typescript-eslint/require-await
	public async *run(vm: VM) {
		const template = vm.templateMap.get(0);
		assert.cond(
			template != null,
			"Character template with id 0 does not exist",
		);

		vm.characterList.push(new Character(vm, template));

		return null;
	}
}
