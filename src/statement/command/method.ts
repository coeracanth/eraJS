import * as E from "../../error.ts";
import * as X from "../../parser/expr.ts";
import * as U from "../../parser/util.ts";
import Lazy from "../../lazy.ts";
import Slice from "../../slice.ts";
import type { Leaf } from "../../value/index.ts";
import type VM from "../../vm.ts";
import type Expr from "../expr/index.ts";
import Statement from "../index.ts";
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

const PARSER = U.argNR0(X.expr);
export default class Method extends Statement {
  public name: string;
  public arg: Lazy<Expr[]>;

  public constructor(name: string, raw: Slice) {
    super(raw);

    this.name = name;
    this.arg = new Lazy(raw, PARSER);
  }

  public async *run(vm: VM) {
    const arg = this.arg.get();
    let result: Leaf;
    switch (this.name) {
      case "ABS":
        result = await abs(vm, arg);
        break;
      case "BARSTR":
        result = await barStr(vm, arg);
        break;
      case "CSVABL":
        result = BigInt(await csvAbl(vm, arg));
        break;
      case "CSVBASE":
        result = BigInt(await csvBase(vm, arg));
        break;
      case "CSVCALLNAME":
        result = await csvCallname(vm, arg);
        break;
      case "CSVCFLAG":
        result = BigInt(await csvCflag(vm, arg));
        break;
      case "CSVCSTR":
        result = await csvCstr(vm, arg);
        break;
      case "CSVEQUIP":
        result = BigInt(await csvEquip(vm, arg));
        break;
      case "CSVEXP":
        result = BigInt(await csvExp(vm, arg));
        break;
      case "CSVJUEL":
        result = BigInt(await csvJuel(vm, arg));
        break;
      case "CSVMARK":
        result = BigInt(await csvMark(vm, arg));
        break;
      case "CSVMASTERNAME":
        result = await csvMastername(vm, arg);
        break;
      case "CSVNAME":
        result = await csvName(vm, arg);
        break;
      case "CSVNICKNAME":
        result = await csvNickname(vm, arg);
        break;
      case "CSVRELATION":
        result = BigInt(await csvRelation(vm, arg));
        break;
      case "CSVTALENT":
        result = BigInt(await csvTalent(vm, arg));
        break;
      case "EXISTCSV":
        result = BigInt(await existCsv(vm, arg));
        break;
      case "FINDCHARA":
        result = await findChara(vm, arg);
        break;
      case "FINDLASTCHARA":
        result = await findLastChara(vm, arg);
        break;
      case "GETBGCOLOR":
        result = BigInt(getBgColor(vm, arg));
        break;
      case "GETBIT":
        result = BigInt(await getBit(vm, arg));
        break;
      case "GETCHARA":
        result = BigInt(await getChara(vm, arg));
        break;
      case "GETCOLOR":
        result = BigInt(getColor(vm, arg));
        break;
      case "GETDEFBGCOLOR":
        result = BigInt(getDefBgColor(vm, arg));
        break;
      case "GETDEFCOLOR":
        result = BigInt(getDefColor(vm, arg));
        break;
      case "GETFOCUSCOLOR":
        result = BigInt(getFocusColor(vm, arg));
        break;
      case "GROUPMATCH":
        result = BigInt(await groupMatch(vm, arg));
        break;
      case "INRANGE":
        result = BigInt(await inRange(vm, arg));
        break;
      case "LIMIT":
        result = await limit(vm, arg);
        break;
      case "LINEISEMPTY":
        result = BigInt(lineIsEmpty(vm, arg));
        break;
      case "MATCH":
        result = BigInt(await match(vm, arg));
        break;
      case "MAX":
        result = await max(vm, arg);
        break;
      case "MAXARRAY":
        result = await maxArray(vm, arg);
        break;
      case "MIN":
        result = await min(vm, arg);
        break;
      case "MINARRAY":
        result = await minArray(vm, arg);
        break;
      case "POWER":
        result = await power(vm, arg);
        break;
      case "RAND":
        result = await rand(vm, arg);
        break;
      case "SIGN":
        result = BigInt(await sign(vm, arg));
        break;
      case "SQRT":
        result = await sqrt(vm, arg);
        break;
      case "STRLENS":
        result = BigInt(await strLenS(vm, arg));
        break;
      case "STRLENSU":
        result = BigInt(await strLenSU(vm, arg));
        break;
      case "SUMARRAY":
        result = await sumArray(vm, arg);
        break;
      case "TOINT":
        result = BigInt(await toInt(vm, arg));
        break;
      case "TOSTR":
        result = await toStr(vm, arg);
        break;
      case "VARSIZE":
        result = BigInt(await varSize(vm, arg));
        break;
      case "UNICODE":
        result = await unicode(vm, arg);
        break;
      default:
        throw E.internal(`${this.name} is not a valid method command`);
    }

    if (typeof result === "bigint") {
      vm.getValue("RESULT").set(vm, result, [0]);
    } else {
      vm.getValue("RESULTS").set(vm, result, [0]);
    }

    return null;
  }
}
