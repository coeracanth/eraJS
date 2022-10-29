import * as E from "../../error.ts";
import * as X from "../../parser/expr.ts";
import * as U from "../../parser/util.ts";
import Lazy from "../../lazy.ts";
import Slice from "../../slice.ts";
import Int1DValue from "../../value/int-1d.ts";
import IntChar0DValue from "../../value/int-char-0d.ts";
import IntChar1DValue from "../../value/int-char-1d.ts";
import StrChar0DValue from "../../value/str-char-0d.ts";
import StrChar1DValue from "../../value/str-char-1d.ts";
import type VM from "../../vm.ts";
import Variable from "../expr/variable.ts";
import Statement from "../index.ts";

const PARSER = U.arg2R0(X.variable, U.alt("FORWARD", "BACK"));
export default class SortChara extends Statement {
	public arg: Lazy<[Variable | undefined, "FORWARD" | "BACK" | undefined]>;

	public constructor(raw: Slice) {
		super(raw);

		this.arg = new Lazy(raw, PARSER);
	}

	public async *run(vm: VM) {
		let [varExpr, order] = this.arg.get();
		varExpr = varExpr ?? new Variable("NO", []);
		order = order ?? "FORWARD";

		const cell = varExpr.getCell(vm);
		const target = vm.getValue<Int1DValue>("TARGET").get(vm, []);
		const assi = vm.getValue<Int1DValue>("ASSI").get(vm, []);
		const master = vm.getValue<Int1DValue>("MASTER").get(vm, []);
		const characterList = vm.characterList.map((character, index) => ({
			character,
			index,
		}));
		if (master >= 0) {
			characterList.splice(Number(master), 1);
		}

		if (cell instanceof IntChar0DValue) {
			characterList.sort((a, b) => {
				const left = cell.get(vm, [a.index]);
				const right = cell.get(vm, [b.index]);
				const compare = Number(left - right);
				return order === "FORWARD" ? compare : -compare;
			});
		} else if (cell instanceof IntChar1DValue) {
			const index = await varExpr.reduceIndex(vm);
			characterList.sort((a, b) => {
				const left = cell.get(vm, [a.index, ...index]);
				const right = cell.get(vm, [b.index, ...index]);
				const compare = Number(left - right);
				return order === "FORWARD" ? compare : -compare;
			});
		} else if (cell instanceof StrChar0DValue) {
			characterList.sort((a, b) => {
				const left = cell.get(vm, [a.index]);
				const right = cell.get(vm, [b.index]);
				const compare = left.localeCompare(right);
				return order === "FORWARD" ? compare : -compare;
			});
		} else if (cell instanceof StrChar1DValue) {
			const index = await varExpr.reduceIndex(vm);
			characterList.sort((a, b) => {
				const left = cell.get(vm, [a.index, ...index]);
				const right = cell.get(vm, [b.index, ...index]);
				const compare = left.localeCompare(right);
				return order === "FORWARD" ? compare : -compare;
			});
		} else {
			throw E.misc("Sort key of SORTCHARA is not a character variable");
		}

		for (let i = 0; i < characterList.length; ++i) {
			if (characterList[i].index === Number(target)) {
				vm.getValue<Int1DValue>("TARGET").set(vm, BigInt(i), []);
			}
			if (characterList[i].index === Number(assi)) {
				vm.getValue<Int1DValue>("ASSI").set(vm, BigInt(i), []);
			}
		}
		if (master >= 0) {
			characterList.splice(Number(master), 0, {
				character: vm.characterList[Number(master)],
				index: -1,
			});
		}
		vm.characterList = characterList.map(({ character }) => character);

		return null;
	}
}
