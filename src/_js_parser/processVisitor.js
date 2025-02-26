// Generated from /home/kng/repo/vor-stream/cmd/process/process.g4 by ANTLR 4.12.0
// jshint ignore: start
import antlr4 from "antlr4";

// This class defines a complete generic visitor for a parse tree produced by processParser.

export default class processVisitor extends antlr4.tree.ParseTreeVisitor {
  // Visit a parse tree produced by processParser#parse.
  visitParse(ctx) {
    return this.visitChildren(ctx);
  }

  // Visit a parse tree produced by processParser#parseerror.
  visitParseerror(ctx) {
    return this.visitChildren(ctx);
  }

  // Visit a parse tree produced by processParser#processStmtList.
  visitProcessStmtList(ctx) {
    return this.visitChildren(ctx);
  }

  // Visit a parse tree produced by processParser#process.
  visitProcess(ctx) {
    return this.visitChildren(ctx);
  }

  // Visit a parse tree produced by processParser#nameStmt.
  visitNameStmt(ctx) {
    return this.visitChildren(ctx);
  }

  // Visit a parse tree produced by processParser#descrStmt.
  visitDescrStmt(ctx) {
    return this.visitChildren(ctx);
  }

  // Visit a parse tree produced by processParser#typeStmt.
  visitTypeStmt(ctx) {
    return this.visitChildren(ctx);
  }

  // Visit a parse tree produced by processParser#processType.
  visitProcessType(ctx) {
    return this.visitChildren(ctx);
  }

  // Visit a parse tree produced by processParser#subprocess.
  visitSubprocess(ctx) {
    return this.visitChildren(ctx);
  }

  // Visit a parse tree produced by processParser#inStmt.
  visitInStmt(ctx) {
    return this.visitChildren(ctx);
  }

  // Visit a parse tree produced by processParser#outStmt.
  visitOutStmt(ctx) {
    return this.visitChildren(ctx);
  }

  // Visit a parse tree produced by processParser#nodeStmt.
  visitNodeStmt(ctx) {
    return this.visitChildren(ctx);
  }

  // Visit a parse tree produced by processParser#sqlStmt.
  visitSqlStmt(ctx) {
    return this.visitChildren(ctx);
  }

  // Visit a parse tree produced by processParser#sasStmt.
  visitSasStmt(ctx) {
    return this.visitChildren(ctx);
  }

  // Visit a parse tree produced by processParser#processStmt.
  visitProcessStmt(ctx) {
    return this.visitChildren(ctx);
  }

  // Visit a parse tree produced by processParser#csvIn.
  visitCsvIn(ctx) {
    return this.visitChildren(ctx);
  }

  // Visit a parse tree produced by processParser#pgIn.
  visitPgIn(ctx) {
    return this.visitChildren(ctx);
  }

  // Visit a parse tree produced by processParser#sasInput.
  visitSasInput(ctx) {
    return this.visitChildren(ctx);
  }

  // Visit a parse tree produced by processParser#datasetName.
  visitDatasetName(ctx) {
    return this.visitChildren(ctx);
  }

  // Visit a parse tree produced by processParser#csvOut.
  visitCsvOut(ctx) {
    return this.visitChildren(ctx);
  }

  // Visit a parse tree produced by processParser#csvFile.
  visitCsvFile(ctx) {
    return this.visitChildren(ctx);
  }

  // Visit a parse tree produced by processParser#csvOutName.
  visitCsvOutName(ctx) {
    return this.visitChildren(ctx);
  }

  // Visit a parse tree produced by processParser#pgOut.
  visitPgOut(ctx) {
    return this.visitChildren(ctx);
  }

  // Visit a parse tree produced by processParser#pgName.
  visitPgName(ctx) {
    return this.visitChildren(ctx);
  }

  // Visit a parse tree produced by processParser#pgAnyName.
  visitPgAnyName(ctx) {
    return this.visitChildren(ctx);
  }

  // Visit a parse tree produced by processParser#s3Out.
  visitS3Out(ctx) {
    return this.visitChildren(ctx);
  }

  // Visit a parse tree produced by processParser#s3In.
  visitS3In(ctx) {
    return this.visitChildren(ctx);
  }

  // Visit a parse tree produced by processParser#s3Path.
  visitS3Path(ctx) {
    return this.visitChildren(ctx);
  }

  // Visit a parse tree produced by processParser#s3Component.
  visitS3Component(ctx) {
    return this.visitChildren(ctx);
  }

  // Visit a parse tree produced by processParser#s3AnyName.
  visitS3AnyName(ctx) {
    return this.visitChildren(ctx);
  }

  // Visit a parse tree produced by processParser#outOpts.
  visitOutOpts(ctx) {
    return this.visitChildren(ctx);
  }

  // Visit a parse tree produced by processParser#s3outOpts.
  visitS3outOpts(ctx) {
    return this.visitChildren(ctx);
  }

  // Visit a parse tree produced by processParser#inOpts.
  visitInOpts(ctx) {
    return this.visitChildren(ctx);
  }

  // Visit a parse tree produced by processParser#s3inOpts.
  visitS3inOpts(ctx) {
    return this.visitChildren(ctx);
  }

  // Visit a parse tree produced by processParser#inSelect.
  visitInSelect(ctx) {
    return this.visitChildren(ctx);
  }

  // Visit a parse tree produced by processParser#database.
  visitDatabase(ctx) {
    return this.visitChildren(ctx);
  }

  // Visit a parse tree produced by processParser#delim.
  visitDelim(ctx) {
    return this.visitChildren(ctx);
  }

  // Visit a parse tree produced by processParser#delimiters.
  visitDelimiters(ctx) {
    return this.visitChildren(ctx);
  }

  // Visit a parse tree produced by processParser#execWhen.
  visitExecWhen(ctx) {
    return this.visitChildren(ctx);
  }

  // Visit a parse tree produced by processParser#whenList.
  visitWhenList(ctx) {
    return this.visitChildren(ctx);
  }

  // Visit a parse tree produced by processParser#whenTag.
  visitWhenTag(ctx) {
    return this.visitChildren(ctx);
  }

  // Visit a parse tree produced by processParser#pg.
  visitPg(ctx) {
    return this.visitChildren(ctx);
  }

  // Visit a parse tree produced by processParser#mssql.
  visitMssql(ctx) {
    return this.visitChildren(ctx);
  }

  // Visit a parse tree produced by processParser#csv.
  visitCsv(ctx) {
    return this.visitChildren(ctx);
  }

  // Visit a parse tree produced by processParser#s3.
  visitS3(ctx) {
    return this.visitChildren(ctx);
  }

  // Visit a parse tree produced by processParser#bulkStatement.
  visitBulkStatement(ctx) {
    return this.visitChildren(ctx);
  }

  // Visit a parse tree produced by processParser#bulkOpts.
  visitBulkOpts(ctx) {
    return this.visitChildren(ctx);
  }

  // Visit a parse tree produced by processParser#checkConstraints.
  visitCheckConstraints(ctx) {
    return this.visitChildren(ctx);
  }

  // Visit a parse tree produced by processParser#fireTriggers.
  visitFireTriggers(ctx) {
    return this.visitChildren(ctx);
  }

  // Visit a parse tree produced by processParser#keepNulls.
  visitKeepNulls(ctx) {
    return this.visitChildren(ctx);
  }

  // Visit a parse tree produced by processParser#kiloBytesPerBatch.
  visitKiloBytesPerBatch(ctx) {
    return this.visitChildren(ctx);
  }

  // Visit a parse tree produced by processParser#rowsPerBatch.
  visitRowsPerBatch(ctx) {
    return this.visitChildren(ctx);
  }

  // Visit a parse tree produced by processParser#order.
  visitOrder(ctx) {
    return this.visitChildren(ctx);
  }

  // Visit a parse tree produced by processParser#tabLock.
  visitTabLock(ctx) {
    return this.visitChildren(ctx);
  }

  // Visit a parse tree produced by processParser#nodeOpts.
  visitNodeOpts(ctx) {
    return this.visitChildren(ctx);
  }

  // Visit a parse tree produced by processParser#sasOpts.
  visitSasOpts(ctx) {
    return this.visitChildren(ctx);
  }

  // Visit a parse tree produced by processParser#sascmd.
  visitSascmd(ctx) {
    return this.visitChildren(ctx);
  }

  // Visit a parse tree produced by processParser#sasFile.
  visitSasFile(ctx) {
    return this.visitChildren(ctx);
  }

  // Visit a parse tree produced by processParser#workDir.
  visitWorkDir(ctx) {
    return this.visitChildren(ctx);
  }

  // Visit a parse tree produced by processParser#dirList.
  visitDirList(ctx) {
    return this.visitChildren(ctx);
  }

  // Visit a parse tree produced by processParser#dir.
  visitDir(ctx) {
    return this.visitChildren(ctx);
  }

  // Visit a parse tree produced by processParser#scenario.
  visitScenario(ctx) {
    return this.visitChildren(ctx);
  }

  // Visit a parse tree produced by processParser#framework.
  visitFramework(ctx) {
    return this.visitChildren(ctx);
  }

  // Visit a parse tree produced by processParser#sasIn.
  visitSasIn(ctx) {
    return this.visitChildren(ctx);
  }

  // Visit a parse tree produced by processParser#sasOut.
  visitSasOut(ctx) {
    return this.visitChildren(ctx);
  }

  // Visit a parse tree produced by processParser#sasQueueOpts.
  visitSasQueueOpts(ctx) {
    return this.visitChildren(ctx);
  }

  // Visit a parse tree produced by processParser#dsName.
  visitDsName(ctx) {
    return this.visitChildren(ctx);
  }

  // Visit a parse tree produced by processParser#dataSet.
  visitDataSet(ctx) {
    return this.visitChildren(ctx);
  }

  // Visit a parse tree produced by processParser#partitioned.
  visitPartitioned(ctx) {
    return this.visitChildren(ctx);
  }

  // Visit a parse tree produced by processParser#nameSolo.
  visitNameSolo(ctx) {
    return this.visitChildren(ctx);
  }

  // Visit a parse tree produced by processParser#number.
  visitNumber(ctx) {
    return this.visitChildren(ctx);
  }

  // Visit a parse tree produced by processParser#inputQueues.
  visitInputQueues(ctx) {
    return this.visitChildren(ctx);
  }

  // Visit a parse tree produced by processParser#outputQueues.
  visitOutputQueues(ctx) {
    return this.visitChildren(ctx);
  }

  // Visit a parse tree produced by processParser#nodesInputQueues.
  visitNodesInputQueues(ctx) {
    return this.visitChildren(ctx);
  }

  // Visit a parse tree produced by processParser#mergeList.
  visitMergeList(ctx) {
    return this.visitChildren(ctx);
  }

  // Visit a parse tree produced by processParser#nameOrList.
  visitNameOrList(ctx) {
    return this.visitChildren(ctx);
  }

  // Visit a parse tree produced by processParser#queue.
  visitQueue(ctx) {
    return this.visitChildren(ctx);
  }

  // Visit a parse tree produced by processParser#namedParameter.
  visitNamedParameter(ctx) {
    return this.visitChildren(ctx);
  }

  // Visit a parse tree produced by processParser#queueList.
  visitQueueList(ctx) {
    return this.visitChildren(ctx);
  }

  // Visit a parse tree produced by processParser#nameDescr.
  visitNameDescr(ctx) {
    return this.visitChildren(ctx);
  }

  // Visit a parse tree produced by processParser#nameDescrPredict.
  visitNameDescrPredict(ctx) {
    return this.visitChildren(ctx);
  }

  // Visit a parse tree produced by processParser#predict.
  visitPredict(ctx) {
    return this.visitChildren(ctx);
  }

  // Visit a parse tree produced by processParser#compress.
  visitCompress(ctx) {
    return this.visitChildren(ctx);
  }

  // Visit a parse tree produced by processParser#minimize.
  visitMinimize(ctx) {
    return this.visitChildren(ctx);
  }

  // Visit a parse tree produced by processParser#syntaxVersion.
  visitSyntaxVersion(ctx) {
    return this.visitChildren(ctx);
  }

  // Visit a parse tree produced by processParser#trueFalse.
  visitTrueFalse(ctx) {
    return this.visitChildren(ctx);
  }

  // Visit a parse tree produced by processParser#name.
  visitName(ctx) {
    return this.visitChildren(ctx);
  }

  // Visit a parse tree produced by processParser#descr.
  visitDescr(ctx) {
    return this.visitChildren(ctx);
  }

  // Visit a parse tree produced by processParser#quoteString.
  visitQuoteString(ctx) {
    return this.visitChildren(ctx);
  }

  // Visit a parse tree produced by processParser#setSig.
  visitSetSig(ctx) {
    return this.visitChildren(ctx);
  }

  // Visit a parse tree produced by processParser#getSig.
  visitGetSig(ctx) {
    return this.visitChildren(ctx);
  }

  // Visit a parse tree produced by processParser#setFact.
  visitSetFact(ctx) {
    return this.visitChildren(ctx);
  }

  // Visit a parse tree produced by processParser#getFact.
  visitGetFact(ctx) {
    return this.visitChildren(ctx);
  }

  // Visit a parse tree produced by processParser#lang.
  visitLang(ctx) {
    return this.visitChildren(ctx);
  }

  // Visit a parse tree produced by processParser#anyName.
  visitAnyName(ctx) {
    return this.visitChildren(ctx);
  }

  // Visit a parse tree produced by processParser#path.
  visitPath(ctx) {
    return this.visitChildren(ctx);
  }

  // Visit a parse tree produced by processParser#everythingSemi.
  visitEverythingSemi(ctx) {
    return this.visitChildren(ctx);
  }

  // Visit a parse tree produced by processParser#where.
  visitWhere(ctx) {
    return this.visitChildren(ctx);
  }

  // Visit a parse tree produced by processParser#writeMode.
  visitWriteMode(ctx) {
    return this.visitChildren(ctx);
  }

  // Visit a parse tree produced by processParser#keyword.
  visitKeyword(ctx) {
    return this.visitChildren(ctx);
  }
}
