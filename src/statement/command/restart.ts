import * as U from "../../parser/util.ts";
import Fn from "../../fn.ts";
import Slice from "../../slice.ts";
import Statement from "../index.ts";

const PARSER = U.arg0R0();
export default class Restart extends Statement {
	public constructor(raw: Slice) {
		super(raw);

		U.tryParse(PARSER, raw);
	}

	// eslint-disable-next-line @typescript-eslint/require-await
	public async *run() {
		return {
			type: "goto",
			label: Fn.START_OF_FN,
		} as const;
	}
}
