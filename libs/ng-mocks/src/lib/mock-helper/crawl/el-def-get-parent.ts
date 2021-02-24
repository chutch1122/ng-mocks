import { DebugElement, ViewContainerRef } from '@angular/core';

import coreInjector from '../../common/core.injector';

import elDefGetNode from './el-def-get-node';

const getVcr = (node: any, child: any): undefined | ViewContainerRef => {
  if (node === child) {
    return undefined;
  }
  if (child.nativeNode.nodeName !== '#comment') {
    return undefined;
  }

  return coreInjector(ViewContainerRef, child.injector);
};

const scanViewRef = (node: DebugElement) => {
  let result: any;
  let index: any;

  for (const child of node.parent?.childNodes || []) {
    const vcr = getVcr(node, child);
    if (!vcr) {
      continue;
    }

    for (let vrIndex = 0; vrIndex < vcr.length; vrIndex += 1) {
      const vr = vcr.get(vrIndex);
      for (let rnIndex = 0; rnIndex < (vr as any).rootNodes.length; rnIndex += 1) {
        const rootNode = (vr as any).rootNodes[rnIndex];
        if (rootNode === node.nativeNode && (index === undefined || rnIndex < index)) {
          result = elDefGetNode(child);
          index = rnIndex;
        }
      }
    }
  }

  return result;
};

export default (node: any) => {
  return (
    (undefined as any) ||
    node.injector._tNode?.parent || // ivy
    node.injector.elDef?.parent || // classic
    scanViewRef(node) ||
    node.parent?.injector._tNode || // ivy
    node.parent?.injector.elDef || // classic
    undefined
  );
};
