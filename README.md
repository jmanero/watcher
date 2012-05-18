watcher
=======

Based upon [Mikeal Rogers'](/mikeal) [watch](/mikeal/watch) library.

Watch a file tree and emit appropriate events for various changes. Extends EventEmitter.
Uses FS.watch to monitor files for change, and re-scans directories periodically to detect
new creations and deletions.

_Polling allows watcher to function on most operating systems where FS.watch
or FS.watchFile are not fully supported or have inconsistent behavior. FS.watch is
still used to monitor file changes asynchronously._

##Class: Watch
* constructor({object}options)
options:
  * root: top-level folder to watch
  * refresh: interval to 
* start(): Start the watcher
* stop(): Stop the watcher

### WatchEvent
* path: Path of the affected node relative to the watch tree root
* dir: boolean, indicates whether or not the node is a folder

###Events
Events emit a WatchEvent object
* watching: Emitted when a new file or folder is added to the watch list
* create: Emitted when a new file is detected in the watched tree
* change: Emitted when a file in the watch list is changed
* delete: emitted when a file or folder is deleted from the watched tree

##Class: Search
* constructor({object}options)
options:
  * root: top-level folder to search in
  * filter: function(path) called for each path found in tree. Return true to emit
path and search with in if directory
* start(): Start traversing

###Events
Events emit the path of the located node relative to the specified root. This allows
trees to be mirrored in different roots.
* file: Emitted when a file node is located
* folder: Emitted when a folder node is located
