import {assertNumber} from "../../assert";
import * as E from "../../erb/expr";
import * as U from "../../erb/util";
import Lazy from "../../lazy";
import type VM from "../../vm";
import type Expr from "../expr";
import Statement from "../index";

const PARSER = U.argNR0(E.expr);
export default class DelChara extends Statement {
	public charaters: Lazy<Expr[]>;

	public constructor(raw: string) {
		super();
		this.charaters = new Lazy(raw, PARSER);
	}

	public *run(vm: VM) {
		const indexList = this.charaters.get().map((c) => c.reduce(vm));
		indexList.forEach((index) => assertNumber(index, "Character index should be an integer"));
		indexList.sort();
		indexList.reverse();

		const charaNum = vm.getValue("CHARANUM");
		for (const index of indexList as number[]) {
			vm.characterList.splice(index, 1);
			charaNum.set(vm, charaNum.get(vm, []) as number - 1, []);
		}

		return null;
	}
}
