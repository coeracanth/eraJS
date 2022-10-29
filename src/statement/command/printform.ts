import * as X from "../../parser/expr.ts";
import * as U from "../../parser/util.ts";
import Lazy from "../../lazy.ts";
import { PrintFlag } from "../../printer.ts";
import Slice from "../../slice.ts";
import type VM from "../../vm.ts";
import Form from "../expr/form.ts";
import Statement from "../index.ts";

const PARSER = U.arg1R0(X.form[""]).map((form) =>
  form ?? new Form([{ value: "" }])
);
export default class PrintForm extends Statement {
  public flags: Set<PrintFlag>;
  public arg: Lazy<Form>;

  public constructor(flags: PrintFlag[], raw: Slice) {
    super(raw);

    this.flags = new Set(flags);
    this.arg = new Lazy(raw, PARSER);
  }

  public async *run(vm: VM) {
    if (vm.printer.skipDisp) {
      return null;
    }

    const value = await this.arg.get().reduce(vm);
    yield* vm.printer.print(value, this.flags);

    return null;
  }
}
