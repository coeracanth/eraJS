import type Expr from "../statement/expr/index.ts";

export default class Define {
	public name: string;
	public expr?: Expr;

	public constructor(name: Define["name"], expr?: Define["expr"]) {
		this.name = name;
		this.expr = expr;
	}
}
