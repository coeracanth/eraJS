import P from "../../../deps/parsimmon.ts";

import * as assert from "../../assert.ts";
import * as X from "../../parser/expr.ts";
import * as U from "../../parser/util.ts";
import Lazy from "../../lazy.ts";
import Slice from "../../slice.ts";
import type VM from "../../vm.ts";
import type Expr from "../expr/index.ts";
import Form from "../expr/form.ts";
import Statement from "../index.ts";
import Call from "./call.ts";

export default class CallForm extends Statement {
	public static PARSER(exclude: keyof (typeof X.form)) {
		return P.alt<[Form, Array<Expr | undefined>]>(
			U.arg1R1(
				P.seq(
					X.form[exclude],
					U.wrap("(", ")", U.sepBy0(",", U.optional(X.expr))),
				),
			),
			U.argNR1(X.form[exclude], U.optional(X.expr)).map((
				[f, ...r],
			) => [f, r]),
		);
	}

	public arg: Lazy<[Form, Array<Expr | undefined>]>;

	public constructor(raw: Slice) {
		super(raw);

		this.arg = new Lazy(raw, CallForm.PARSER("(,"));
	}

	public async *run(vm: VM) {
		const [targetExpr, argExpr] = this.arg.get();
		const target = await targetExpr.reduce(vm);
		assert.string(target, "1st argument of CALLFORM must be a string");

		return yield* Call.exec(vm, target, argExpr);
	}
}
