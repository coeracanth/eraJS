import * as E from "../../error.ts";
import * as X from "../../parser/expr.ts";
import * as U from "../../parser/util.ts";
import Lazy from "../../lazy.ts";
import Slice from "../../slice.ts";
import type Expr from "../expr/index.ts";
import Statement from "../index.ts";

const PARSER = U.arg1R1(X.expr);
export default class AddCopyChara extends Statement {
	public arg: Lazy<Expr>;

	public constructor(raw: Slice) {
		super(raw);

		this.arg = new Lazy(raw, PARSER);
	}

	// eslint-disable-next-line @typescript-eslint/require-await
	public async *run() {
		throw E.notImpl("ADDCOPYCHARA");

		return null;
	}
}
