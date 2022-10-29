import dayjs from "../../../deps/dayjs.ts";

import * as U from "../../parser/util.ts";
import Slice from "../../slice.ts";
import type VM from "../../vm.ts";
import Statement from "../index.ts";

// 719162 is number of days from 0001-01-01 to 1970-01-01
const UNIX_EPOCH = 719162 * 24 * 60 * 60;
const PARSER = U.arg0R0();
export default class GetMillisecond extends Statement {
	public constructor(raw: Slice) {
		super(raw);

		U.tryParse(PARSER, raw);
	}

	// eslint-disable-next-line @typescript-eslint/require-await
	public async *run(vm: VM) {
		const time = dayjs(vm.external.getTime());

		vm.getValue("RESULT").set(
			vm,
			BigInt(time.valueOf() - UNIX_EPOCH * 1000),
			[0],
		);

		return null;
	}
}
