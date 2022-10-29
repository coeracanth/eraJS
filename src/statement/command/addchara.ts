import * as assert from "../../assert.ts";
import Character from "../../character.ts";
import * as X from "../../parser/expr.ts";
import * as U from "../../parser/util.ts";
import Lazy from "../../lazy.ts";
import Slice from "../../slice.ts";
import type VM from "../../vm.ts";
import type Expr from "../expr/index.ts";
import Statement from "../index.ts";

const PARSER = U.argNR0(X.expr);
export default class AddChara extends Statement {
	public arg: Lazy<Expr[]>;

	public constructor(raw: Slice) {
		super(raw);

		this.arg = new Lazy(raw, PARSER);
	}

	public async *run(vm: VM) {
		for (const expr of this.arg.get()) {
			const id = await expr.reduce(vm);
			assert.bigint(id, "Character id should be an integer");

			const template = vm.templateMap.get(Number(id));
			assert.cond(
				template != null,
				`Character template with id ${id} does not exist`,
			);

			vm.characterList.push(new Character(vm, template));
		}

		return null;
	}
}
