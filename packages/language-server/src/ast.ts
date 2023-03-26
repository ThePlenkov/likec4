import * as ast from './generated/ast'
import { DocumentState, LangiumDocument } from 'langium'
import type { LikeC4Document } from './generated/ast'
import type * as c4 from '@likec4/core/types'
import objectHash from 'object-hash'
import { elementRef } from './elementRef'
import { LikeC4LanguageMetaData } from './generated/module'

export { ast }

export function c4hash({
  c4Specification,
  c4Elements,
  c4Relations
}: LikeC4LangiumDocument) {
  return objectHash({
    c4Specification,
    c4Elements,
    c4Relations
  }, {
    respectType: false,
  })
}

export interface ParsedAstSpecification {
  kinds: Record<c4.ElementKind, {
    shape: c4.ElementShape
  }>
}


export interface ParsedAstElement {
  id: c4.Fqn
  kind: c4.ElementKind
  title: string
  tags?: c4.Tag[]
}

export interface ParsedAstRelation {
  id: c4.RelationID
  astNodePath: string
  source: c4.Fqn
  target: c4.Fqn
  title: string
}

export interface LikeC4LangiumDocument extends LangiumDocument<LikeC4Document> {
  c4hash?: string
  c4Specification: ParsedAstSpecification
  c4Elements: ParsedAstElement[]
  c4Relations: ParsedAstRelation[]
}

export function cleanParsedModel(doc: LikeC4LangiumDocument) {
  doc.c4Specification = {
    kinds: {}
  }
  const elements = doc.c4Elements = [] as LikeC4LangiumDocument['c4Elements']
  const relations = doc.c4Relations = [] as LikeC4LangiumDocument['c4Relations']
  return {
    elements,
    relations,
    specification: doc.c4Specification
  }
}

export function isLikeC4LangiumDocument(doc: LangiumDocument): doc is LikeC4LangiumDocument {
  return doc.textDocument.languageId === LikeC4LanguageMetaData.languageId
}

export const isValidDocument = (doc: LangiumDocument): doc is LikeC4LangiumDocument => {
  if (!isLikeC4LangiumDocument(doc)) return false
  const { state, parseResult, diagnostics } = doc
  return (
    state === DocumentState.Validated
    && parseResult.lexerErrors.length === 0
    && (!diagnostics || diagnostics.every(d => d.severity !== 1))
  )
}

export function* streamElements(doc: LikeC4LangiumDocument) {
  const elements = doc.parseResult.value.model?.elements ?? []
  let traverseStack = [...elements] as (ast.Element | ast.ExtendElement | ast.Relation)[]
  let el
  while (el = traverseStack.shift()) {
    if (ast.isExtendElement(el)) {
      traverseStack.push(...el.elements)
      continue
    }
    if (ast.isElement(el) && el.definition && el.definition.elements.length > 0) {
      traverseStack.push(...el.definition.elements)
    }
    yield el
  }
}

export function resolveRelationPoints(node: ast.Relation): {
  source: ast.Element
  target: ast.Element
} {
  const target = elementRef(node.target)
  if (!target) {
    throw new Error('Skip relation due to invalid reference to target')
  }
  if (ast.isRelationWithSource(node)) {
    const source = elementRef(node.source)
    if (!source) {
      throw new Error('Skip relation due to invalid reference to source')
    }
    return {
      source,
      target
    }
  }
  if (!ast.isElementBody(node.$container)) {
    throw new Error('Skip relation due to invalid reference to source')
  }
  const source = node.$container.$container
  return {
    source,
    target
  }
}


export function toElementStyle(props: ast.ElementStyleProperty[]): c4.ElementStyle {
  const result: c4.ElementStyle = {}

  const shapeProperty = props.find(ast.isElementShapeStyleProperty)
  if (shapeProperty) {
    result.shape = shapeProperty.value
  }

  // const colorPropValue = props.find(isColorStyleProperty)?.value
  // if (isElementStyleColor(colorPropValue)) {
  //   result.color = colorPropValue
  // }

  // const iconProp = props.find(isIconStyleProperty)
  // if (iconProp) {
  //   result.icon = iconProp.value
  // }

  return result
}
