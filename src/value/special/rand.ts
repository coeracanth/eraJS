import * as assert from "../../assert.ts";
import * as E from "../../error.ts";
import type VM from "../../vm.ts";
import type { default as Value, Leaf } from "../index.ts";

export default class RandValue implements Value<never> {
	public type = "number" as const;
	public name = "RAND" as const;
	public value!: never;

	public constructor() {
		// Do nothing
	}

	public reset(): this {
		throw E.internal(`${this.name} cannot be reset`);
	}

	public get(vm: VM, index: number[]): bigint {
		assert.cond(index.length === 1, "RAND must be indexed by 1 value");

		return BigInt(Math.floor(vm.random.next() % index[0]));
	}

	public set(_vm: VM, _value: Leaf, _index: number[]) {
		throw new Error("Cannot assign a value to RAND");
	}

	public rangeSet(
		_vm: VM,
		_value: Leaf,
		_index: number[],
		_range: [number, number],
	) {
		throw new Error("Cannot assign a value to RAND");
	}

	public length(_depth: number): number {
		throw new Error("Cannot get the length of RAND");
	}
}
