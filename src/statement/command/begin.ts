import Lazy from "../../lazy.ts";
import * as C from "../../parser/const.ts";
import * as U from "../../parser/util.ts";
import Slice from "../../slice.ts";
import Statement from "../index.ts";

const PARSER = U.arg1R1(C.Identifier);
export default class Begin extends Statement {
	public arg: Lazy<string>;

	public constructor(raw: Slice) {
		super(raw);

		this.arg = new Lazy(raw, PARSER);
	}

	// eslint-disable-next-line @typescript-eslint/require-await
	public async *run() {
		return {
			type: "begin",
			keyword: this.arg.get(),
		} as const;
	}
}
