import * as assert from "../../assert.ts";
import type { Leaf } from "../../value/index.ts";
import type VM from "../../vm.ts";
import type Expr from "./index.ts";
import type { EraGenerator } from "../index.ts";
import abs from "../method/abs.ts";
import barStr from "../method/barstr.ts";
import csvAbl from "../method/csvabl.ts";
import csvBase from "../method/csvbase.ts";
import csvCallname from "../method/csvcallname.ts";
import csvCflag from "../method/csvcflag.ts";
import csvCstr from "../method/csvcstr.ts";
import csvEquip from "../method/csvequip.ts";
import csvExp from "../method/csvexp.ts";
import csvJuel from "../method/csvjuel.ts";
import csvMark from "../method/csvmark.ts";
import csvMastername from "../method/csvmastername.ts";
import csvName from "../method/csvname.ts";
import csvNickname from "../method/csvnickname.ts";
import csvRelation from "../method/csvrelation.ts";
import csvTalent from "../method/csvtalent.ts";
import existCsv from "../method/existcsv.ts";
import findChara from "../method/findchara.ts";
import findLastChara from "../method/findlastchara.ts";
import getBgColor from "../method/getbgcolor.ts";
import getBit from "../method/getbit.ts";
import getChara from "../method/getchara.ts";
import getColor from "../method/getcolor.ts";
import getDefBgColor from "../method/getdefbgcolor.ts";
import getDefColor from "../method/getdefcolor.ts";
import getFocusColor from "../method/getfocuscolor.ts";
import groupMatch from "../method/groupmatch.ts";
import inRange from "../method/inrange.ts";
import limit from "../method/limit.ts";
import lineIsEmpty from "../method/lineisempty.ts";
import match from "../method/match.ts";
import max from "../method/max.ts";
import maxArray from "../method/maxarray.ts";
import min from "../method/min.ts";
import minArray from "../method/minarray.ts";
import power from "../method/power.ts";
import rand from "../method/rand.ts";
import sign from "../method/sign.ts";
import sqrt from "../method/sqrt.ts";
import strLenS from "../method/strlens.ts";
import strLenSU from "../method/strlensu.ts";
import sumArray from "../method/sumarray.ts";
import toInt from "../method/toint.ts";
import toStr from "../method/tostr.ts";
import varSize from "../method/varsize.ts";
import unicode from "../method/unicode.ts";

async function runGenerator<T>(gen: EraGenerator<T>): Promise<T> {
  while (true) {
    const value = await gen.next();
    if (value.done === true) {
      return value.value;
    }
  }
}

export default class InlineCall implements Expr {
  public name: string;
  public arg: Expr[];

  public constructor(name: string, arg: Expr[]) {
    this.name = name.toUpperCase();
    this.arg = arg;
  }

  public async reduce(vm: VM): Promise<Leaf> {
    switch (this.name.toUpperCase()) {
      case "ABS":
        return abs(vm, this.arg);
      case "BARSTR":
        return barStr(vm, this.arg);
      case "CSVABL":
        return BigInt(await csvAbl(vm, this.arg));
      case "CSVBASE":
        return BigInt(await csvBase(vm, this.arg));
      case "CSVCALLNAME":
        return csvCallname(vm, this.arg);
      case "CSVCFLAG":
        return BigInt(await csvCflag(vm, this.arg));
      case "CSVCSTR":
        return csvCstr(vm, this.arg);
      case "CSVEQUIP":
        return BigInt(await csvEquip(vm, this.arg));
      case "CSVEXP":
        return BigInt(await csvExp(vm, this.arg));
      case "CSVJUEL":
        return BigInt(await csvJuel(vm, this.arg));
      case "CSVMARK":
        return BigInt(await csvMark(vm, this.arg));
      case "CSVMASTERNAME":
        return csvMastername(vm, this.arg);
      case "CSVNAME":
        return csvName(vm, this.arg);
      case "CSVNICKNAME":
        return csvNickname(vm, this.arg);
      case "CSVRELATION":
        return BigInt(await csvRelation(vm, this.arg));
      case "CSVTALENT":
        return BigInt(await csvTalent(vm, this.arg));
      case "EXISTCSV":
        return BigInt(await existCsv(vm, this.arg));
      case "FINDCHARA":
        return findChara(vm, this.arg);
      case "FINDLASTCHARA":
        return findLastChara(vm, this.arg);
      case "GETBGCOLOR":
        return BigInt(getBgColor(vm, this.arg));
      case "GETBIT":
        return BigInt(await getBit(vm, this.arg));
      case "GETCHARA":
        return BigInt(await getChara(vm, this.arg));
      case "GETCOLOR":
        return BigInt(getColor(vm, this.arg));
      case "GETDEFBGCOLOR":
        return BigInt(getDefBgColor(vm, this.arg));
      case "GETDEFCOLOR":
        return BigInt(getDefColor(vm, this.arg));
      case "GETFOCUSCOLOR":
        return BigInt(getFocusColor(vm, this.arg));
      case "GROUPMATCH":
        return BigInt(await groupMatch(vm, this.arg));
      case "INRANGE":
        return BigInt(await inRange(vm, this.arg));
      case "LIMIT":
        return limit(vm, this.arg);
      case "LINEISEMPTY":
        return BigInt(lineIsEmpty(vm, this.arg));
      case "MATCH":
        return BigInt(await match(vm, this.arg));
      case "MAX":
        return max(vm, this.arg);
      case "MAXARRAY":
        return maxArray(vm, this.arg);
      case "MIN":
        return min(vm, this.arg);
      case "MINARRAY":
        return minArray(vm, this.arg);
      case "POWER":
        return power(vm, this.arg);
      case "RAND":
        return rand(vm, this.arg);
      case "SIGN":
        return BigInt(await sign(vm, this.arg));
      case "SQRT":
        return sqrt(vm, this.arg);
      case "STRLENS":
        return BigInt(await strLenS(vm, this.arg));
      case "STRLENSU":
        return BigInt(await strLenSU(vm, this.arg));
      case "SUMARRAY":
        return sumArray(vm, this.arg);
      case "TOINT":
        return BigInt(await toInt(vm, this.arg));
      case "TOSTR":
        return toStr(vm, this.arg);
      case "VARSIZE":
        return BigInt(await varSize(vm, this.arg));
      case "UNICODE":
        return unicode(vm, this.arg);
      default: {
        assert.cond(
          vm.fnMap.has(this.name),
          `Method ${this.name} does not exist`,
        );
        const values: Array<Leaf> = [];
        for (const arg of this.arg) {
          values.push(await arg.reduce(vm));
        }
        const result = await runGenerator(
          vm.fnMap.get(this.name)!.run(vm, values),
        );
        assert.cond(
          // @ts-ignore type is unknown
          result?.type === "return",
          "Inline call should return a value",
        );
        // @ts-ignore type is unknown
        return result.value[0];
      }
    }
  }
}
