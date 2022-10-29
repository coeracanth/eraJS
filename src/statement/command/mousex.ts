import * as E from "../../error.ts";
import * as U from "../../parser/util.ts";
import Slice from "../../slice.ts";
import Statement from "../index.ts";

const PARSER = U.arg0R0();
export default class MouseX extends Statement {
	public constructor(raw: Slice) {
		super(raw);

		U.tryParse(PARSER, raw);
	}

	// eslint-disable-next-line @typescript-eslint/require-await
	public async *run() {
		throw E.notImpl("MOUSEX");

		return null;
	}
}
