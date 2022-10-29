import * as assert from "../../assert.ts";
import Value, { Leaf } from "../../value/index.ts";
import type VM from "../../vm.ts";
import type Expr from "./index.ts";

export default class Variable implements Expr {
	public name: string;
	public index: Expr[];
	public scope?: string;

	public constructor(name: string, index: Expr[], scope?: string) {
		this.name = name.toUpperCase();
		this.index = index;
		this.scope = scope;
	}

	public getCell(vm: VM): Value<any> {
		return vm.getValue(this.name, this.scope);
	}

	public async reduce(vm: VM): Promise<Leaf> {
		if (vm.macroMap.has(this.name)) {
			if (this.index.length !== 0) {
				throw new Error("Macro cannot be indexed");
			}

			const expr = vm.macroMap.get(this.name)?.expr;
			if (expr == null) {
				throw new Error("Empty macro cannot be referenced");
			}

			return expr.reduce(vm);
		} else {
			return this.getCell(vm).get(vm, await this.reduceIndex(vm));
		}
	}

	public async reduceIndex(vm: VM): Promise<number[]> {
		if (this.index.length !== 0) {
			const result: number[] = [];
			for (const i of this.index) {
				const value = await i.reduce(vm);
				assert.bigint(value, "Index of variable should be an integer");
				result.push(Number(value));
			}

			return result;
		} else {
			return [];
		}
	}
}
