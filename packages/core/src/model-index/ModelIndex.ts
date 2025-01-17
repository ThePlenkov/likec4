import { pipe, sort, values } from 'remeda'
import { InvalidModelError, ensureModel } from '../errors'
import type { Element, Fqn, Relation, RelationID } from '../types'
import { compareByFqnHierarchically, parentFqn } from '../utils'

interface ElementTrie {
  el?: Element
  children: Record<string, ElementTrie>
}

function childrenOf(trie: ElementTrie) {
  const children = [] as Element[]
  for (const { el } of values(trie.children)) {
    if (el) {
      children.push(el)
    }
  }
  return children
}

function asPath(id: Fqn) {
  return id.split('.')
}

// interface TaggedResult {
//   elements: Element[]
//   relations: Relation[]
// }

type ModelInput = {
  elements: Record<Fqn, Element>
  relations: Record<RelationID, Relation>
}

export default class ModelIndex {
  private root: ElementTrie = {
    children: {}
  }

  private _elements = new Map<Fqn, Element>()

  private _relations = new Map<RelationID, Relation>()
  // private _taggedElements = new Map<Tag, Set<Element>>()
  // private _taggedRelations = new Map<Tag, Set<Relation>>()

  get relations(): Relation[] {
    return Array.from(this._relations.values())
  }

  filterRelations(predicate: (r: Relation) => boolean): Relation[] {
    return this.relations.filter(predicate)
  }

  static from({ elements, relations }: ModelInput): ModelIndex {
    const index = new ModelIndex()
    const sortedElements = pipe(values(elements), sort(compareByFqnHierarchically))
    for (const el of sortedElements) {
      index.addElement(el)
    }
    for (const rel of values(relations)) {
      index.addRelation(rel)
    }
    return index
  }

  addElement(el: Element) {
    if (this.hasElement(el.id)) {
      throw new InvalidModelError(`Element already exists with id ${el.id}`)
    }
    const path = asPath(el.id)
    let scope = this.root
    for (const name of path) {
      const next = scope.children[name] ?? {
        children: {}
      }
      scope.children[name] = next
      scope = next
    }
    scope.el = el
    this._elements.set(el.id, el)
  }

  private locateTrie = (id: Fqn) => {
    let scope = this.root
    for (const name of asPath(id)) {
      const next = scope.children[name]
      ensureModel(next, `Invalid index, Element not found at path ${name} of ${id}`)
      scope = next
    }
    return scope
  }

  find = (id: Fqn): Element => {
    const el = this._elements.get(id)
    ensureModel(el, `Element not found with id ${id}`)
    return el
  }

  children = (id: Fqn): Element[] => {
    return childrenOf(this.locateTrie(id))
  }

  siblings = (id: Fqn): Element[] => {
    const parent = parentFqn(id)
    const trie = parent ? this.locateTrie(parent) : this.root
    return childrenOf(trie).filter(e => e.id !== id)
  }

  /**
   * Ancestors from closest parent to root
   */
  ancestors(id: Fqn): Element[] {
    const path = asPath(id)
    const ancestors = [] as Element[]
    // The root
    if (path.length === 1) {
      return ancestors
    }
    // Remove the element itself
    path.pop()
    let name = path.shift()
    let trie = this.root
    while (name) {
      const next = trie.children[name]
      ensureModel(next, `Invalid index, Element not found at path ${name} of ${id}`)
      trie = next
      ensureModel(trie.el, `invalid index, no element ${name} found in ${id}`)
      ancestors.unshift(trie.el)
      name = path.shift()
    }
    return ancestors
  }

  // tagged = (tag?: Tag): TaggedResult => {
  //   return tag ? {
  //     elements: [...this._taggedElements.get(tag)?.values() ?? []],
  //     relations: [...this._taggedRelations.get(tag)?.values() ?? []],
  //   } : {
  //     elements: uniq([...this._taggedElements.values()].flatMap(s => [...s.values()])),
  //     relations: uniq([...this._taggedRelations.values()].flatMap(s => [...s.values()]))
  //   }
  // }

  rootElements(): Element[] {
    return childrenOf(this.root)
  }

  get elements(): Element[] {
    return Array.from(this._elements.values())
  }

  hasElement(fqn: Fqn): boolean {
    return this._elements.has(fqn)
  }

  addRelation(rel: Relation) {
    // Validate source and target
    if (!this.hasElement(rel.source)) {
      throw new InvalidModelError(`Source of relation not found ${rel.source}`)
    }
    if (!this.hasElement(rel.target)) {
      throw new InvalidModelError(`Target of relation not found ${rel.target}`)
    }
    this._relations.set(rel.id, rel)
    // for (const tag of rel.tags) {
    //   const tagged = this._taggedRelations.get(tag) ?? new Set()
    //   tagged.add(rel)
    //   this._taggedRelations.set(tag, tagged)
    // }
  }
}
