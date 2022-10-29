import * as assert from "../../assert.ts";
import * as U from "../../parser/util.ts";
import { GlobalSave, savefile } from "../../savedata.ts";
import Slice from "../../slice.ts";
import Int0DValue from "../../value/int-0d.ts";
import Int1DValue from "../../value/int-1d.ts";
import Int2DValue from "../../value/int-2d.ts";
import Int3DValue from "../../value/int-3d.ts";
import Str0DValue from "../../value/str-0d.ts";
import Str1DValue from "../../value/str-1d.ts";
import type VM from "../../vm.ts";
import Statement from "../index.ts";

const PARSER = U.arg0R0();
export default class LoadGlobal extends Statement {
	public constructor(raw: Slice) {
		super(raw);

		U.tryParse(PARSER, raw);
	}

	public async *run(vm: VM) {
		const file = savefile.global;
		const raw = await vm.external.getSavedata(file);

		try {
			assert.nonNull(raw, "");
			const parsed: GlobalSave = JSON.parse(raw);
			const code = vm.code.csv.gamebase.code ?? 0;
			const version = vm.code.csv.gamebase.version ?? 0;
			assert.cond(parsed.code === code, "");
			assert.cond(parsed.version === version, "");
			for (const [name, value] of Object.entries(parsed.data)) {
				const cell = vm.getValue(name);
				if (cell instanceof Int0DValue) {
					assert.string(value, "");
					cell.reset(BigInt(value));
				} else if (cell instanceof Int1DValue) {
					assert.strArray(value, "");
					cell.reset(value.map((v) => BigInt(v)));
				} else if (cell instanceof Int2DValue) {
					assert.strArray2D(value, "");
					cell.reset(value.map((v0) => v0.map((v1) => BigInt(v1))));
				} else if (cell instanceof Int3DValue) {
					assert.strArray3D(value, "");
					cell.reset(
						value.map((v0) =>
							v0.map((v1) => v1.map((v2) => BigInt(v2)))
						),
					);
				} else if (cell instanceof Str0DValue) {
					assert.string(value, "");
					cell.reset(value);
				} else if (cell instanceof Str1DValue) {
					assert.strArray(value, "");
					cell.reset(value);
				} else {
					throw new Error("");
				}
			}

			vm.getValue("RESULT").set(vm, 1n, [0]);
		} catch {
			vm.getValue("RESULT").set(vm, 0n, [0]);
		}

		return null;
	}
}
