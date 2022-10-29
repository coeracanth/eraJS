import * as assert from "./assert.ts";
import type Property from "./property/index.ts";
import Order from "./property/order.ts";
import type { EraGenerator } from "./statement/index.ts";
import Variable from "./statement/expr/variable.ts";
import Thunk from "./thunk.ts";
import { Leaf } from "./value/index.ts";
import type VM from "./vm.ts";

export default class Fn {
	public static START_OF_FN = "@@START";

	public name: string;
	public arg: Array<[Variable, Variable | string | bigint | null]>;
	public property: Property[];
	public thunk: Thunk;

	public constructor(
		name: string,
		arg: Fn["arg"],
		property: Property[],
		thunk: Thunk,
	) {
		this.name = name;
		this.arg = arg;
		this.thunk = thunk;
		this.property = property;

		this.thunk.labelMap.set(Fn.START_OF_FN, 0);
	}

	public isFirst(): boolean {
		return this.property.some((p) =>
			p instanceof Order && p.order === "PRI"
		);
	}

	public isLast(): boolean {
		return this.property.some((p) =>
			p instanceof Order && p.order === "LATER"
		);
	}

	public async *run(
		vm: VM,
		arg: Array<string | bigint | undefined>,
	): EraGenerator {
		await vm.pushContext(this);

		for (let i = 0; i < this.arg.length; ++i) {
			const [argDest, argDef] = this.arg[i];
			const dest = argDest.getCell(vm);
			const index = await argDest.reduceIndex(vm);
			if (dest.type === "number") {
				let value: Leaf;
				// eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
				if (arg[i] != null) {
					value = arg[i]!;
				} else if (argDef != null) {
					if (argDef instanceof Variable) {
						value = await argDef.reduce(vm);
					} else {
						value = argDef;
					}
				} else {
					value = 0n;
				}
				assert.bigint(
					value,
					"Value for number argument must be a number",
				);
				dest.set(vm, value, index);
			} else {
				let value: Leaf;
				// eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
				if (arg[i] != null) {
					value = arg[i]!;
				} else if (argDef != null) {
					if (argDef instanceof Variable) {
						value = await argDef.reduce(vm);
					} else {
						value = argDef;
					}
				} else {
					value = "";
				}
				assert.string(
					value,
					"Value for string argument must be a string",
				);
				dest.set(vm, value, index);
			}
		}

		const result = yield* this.thunk.run(vm);
		vm.popContext();

		return result;
	}
}
