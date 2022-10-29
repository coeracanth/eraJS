import Lazy from "../../lazy.ts";
import Slice from "../../slice.ts";
import type VM from "../../vm.ts";
import Expr from "../expr/index.ts";
import Form from "../expr/form.ts";
import Statement from "../index.ts";
import CallForm from "./callform.ts";
import Jump from "./jump.ts";

export default class JumpForm extends Statement {
	public arg: Lazy<[Form, Array<Expr | undefined>]>;

	public constructor(raw: Slice) {
		super(raw);

		this.arg = new Lazy(raw, CallForm.PARSER("("));
	}

	public async *run(vm: VM) {
		const [targetExpr, argExpr] = this.arg.get();
		const target = await targetExpr.reduce(vm);
		return yield* Jump.exec(vm, target, argExpr);
	}
}
