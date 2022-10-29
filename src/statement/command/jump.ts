import * as assert from "../../assert.ts";
import Lazy from "../../lazy.ts";
import Slice from "../../slice.ts";
import { Leaf } from "../../value/index.ts";
import type VM from "../../vm.ts";
import Expr from "../expr/index.ts";
import Statement from "../index.ts";
import Call from "./call.ts";

export default class Jump extends Statement {
	public static async *exec(
		vm: VM,
		target: string,
		argExpr: Array<Expr | undefined>,
	) {
		const realTarget = target.toUpperCase();
		assert.cond(
			vm.fnMap.has(realTarget),
			`Function ${realTarget} does not exist`,
		);

		const arg: Array<Leaf | undefined> = [];
		for (const a of argExpr) {
			arg.push(await a?.reduce(vm));
		}
		return yield* vm.fnMap.get(realTarget)!.run(vm, arg);
	}

	public arg: Lazy<[string, Array<Expr | undefined>]>;

	public constructor(raw: Slice) {
		super(raw);

		this.arg = new Lazy(raw, Call.PARSER);
	}

	public async *run(vm: VM) {
		const [target, argExpr] = this.arg.get();
		return yield* Jump.exec(vm, target, argExpr);
	}
}
