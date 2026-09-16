/**
 * High-Performance Least Recently Used (LRU) Cache
 * Implemented using a Doubly-Linked List + Hash Map for O(1) reads, writes, and evictions.
 * Supports Time-To-Live (TTL) expiration and Tag-based bulk invalidation.
 */

class DoublyLinkedNode {
    constructor(key = null, value = null, expiresAt = null, tags = []) {
        this.key = key;
        this.value = value;
        this.expiresAt = expiresAt;
        this.tags = tags;
        this.prev = null;
        this.next = null;
    }
}

class LRUCache {
    /**
     * @param {number} capacity - Maximum number of items in the cache (default: 500)
     * @param {number} defaultTTL - Default time-to-live in seconds (default: 300s / 5 mins)
     */
    constructor(capacity = 500, defaultTTL = 300) {
        this.capacity = capacity;
        this.defaultTTL = defaultTTL;
        this.map = new Map(); // key -> DoublyLinkedNode
        this.tagMap = new Map(); // tag -> Set of keys

        // Sentinel dummy head and tail nodes for O(1) list operations
        this.head = new DoublyLinkedNode();
        this.tail = new DoublyLinkedNode();
        this.head.next = this.tail;
        this.tail.prev = this.head;

        // Metrics & Stats
        this.hits = 0;
        this.misses = 0;
    }

    /**
     * Current size of the cache
     * @returns {number}
     */
    get size() {
        return this.map.size;
    }

    /**
     * Internal: Remove a node from its current position in the linked list
     * @param {DoublyLinkedNode} node
     */
    _removeNode(node) {
        node.prev.next = node.next;
        node.next.prev = node.prev;
    }

    /**
     * Internal: Insert a node right after the dummy head (Most Recently Used)
     * @param {DoublyLinkedNode} node
     */
    _addToHead(node) {
        node.next = this.head.next;
        node.prev = this.head;
        this.head.next.prev = node;
        this.head.next = node;
    }

    /**
     * Internal: Move an existing node to the head
     * @param {DoublyLinkedNode} node
     */
    _moveToHead(node) {
        this._removeNode(node);
        this._addToHead(node);
    }

    /**
     * Internal: Pop the least recently used node (node right before tail)
     * @returns {DoublyLinkedNode}
     */
    _popTail() {
        const lastNode = this.tail.prev;
        if (lastNode === this.head) return null;
        this._removeNode(lastNode);
        return lastNode;
    }

    /**
     * Get an item from cache
     * Time Complexity: O(1)
     * @param {string} key
     * @returns {any|null}
     */
    get(key) {
        const node = this.map.get(key);
        if (!node) {
            this.misses++;
            return null;
        }

        // Check if item has expired
        if (node.expiresAt && Date.now() > node.expiresAt) {
            this.delete(key);
            this.misses++;
            return null;
        }

        // Move to head as most recently accessed
        this._moveToHead(node);
        this.hits++;
        return node.value;
    }

    /**
     * Put an item into cache
     * Time Complexity: O(1)
     * @param {string} key
     * @param {any} value
     * @param {number} [ttlSeconds] - Time to live in seconds
     * @param {string[]} [tags] - Categorical tags for group invalidation
     */
    set(key, value, ttlSeconds = this.defaultTTL, tags = []) {
        const expiresAt = ttlSeconds ? Date.now() + ttlSeconds * 1000 : null;

        if (this.map.has(key)) {
            const node = this.map.get(key);
            node.value = value;
            node.expiresAt = expiresAt;

            // Remove old tag mappings if any
            if (node.tags) {
                node.tags.forEach(t => {
                    const set = this.tagMap.get(t);
                    if (set) set.delete(key);
                });
            }

            node.tags = tags;
            this._moveToHead(node);
        } else {
            const newNode = new DoublyLinkedNode(key, value, expiresAt, tags);
            this.map.set(key, newNode);
            this._addToHead(newNode);

            // Evict least recently used if over capacity
            if (this.map.size > this.capacity) {
                const evicted = this._popTail();
                if (evicted) {
                    this.map.delete(evicted.key);
                    if (evicted.tags) {
                        evicted.tags.forEach(t => {
                            const set = this.tagMap.get(t);
                            if (set) set.delete(evicted.key);
                        });
                    }
                }
            }
        }

        // Register new tag mappings
        if (Array.isArray(tags)) {
            tags.forEach(t => {
                if (!this.tagMap.has(t)) {
                    this.tagMap.set(t, new Set());
                }
                this.tagMap.get(t).add(key);
            });
        }
    }

    /**
     * Delete an item by key
     * Time Complexity: O(1)
     * @param {string} key
     * @returns {boolean}
     */
    delete(key) {
        const node = this.map.get(key);
        if (!node) return false;

        this._removeNode(node);
        this.map.delete(key);

        if (node.tags) {
            node.tags.forEach(t => {
                const set = this.tagMap.get(t);
                if (set) set.delete(key);
            });
        }
        return true;
    }

    /**
     * Invalidate all keys associated with one or more tags
     * @param {string|string[]} tags
     * @returns {number} Count of invalidated entries
     */
    invalidateTags(tags) {
        const tagList = Array.isArray(tags) ? tags : [tags];
        let count = 0;

        tagList.forEach(tag => {
            const keys = this.tagMap.get(tag);
            if (keys) {
                keys.forEach(key => {
                    if (this.delete(key)) count++;
                });
                this.tagMap.delete(tag);
            }
        });

        return count;
    }

    /**
     * Clear the entire cache
     */
    clear() {
        this.map.clear();
        this.tagMap.clear();
        this.head.next = this.tail;
        this.tail.prev = this.head;
        this.hits = 0;
        this.misses = 0;
    }

    /**
     * Return cache health and performance metrics
     */
    stats() {
        const total = this.hits + this.misses;
        const hitRate = total > 0 ? ((this.hits / total) * 100).toFixed(2) + '%' : '0%';
        return {
            size: this.map.size,
            capacity: this.capacity,
            hits: this.hits,
            misses: this.misses,
            totalRequests: total,
            hitRate,
            activeTags: Array.from(this.tagMap.keys())
        };
    }
}

// Export singleton instance + class
const defaultCache = new LRUCache(1000, 300); // 1,000 items capacity, 5 min default TTL

module.exports = {
    LRUCache,
    cache: defaultCache
};
