function NewJSClass{
  toString{}
  };
  
//A convenient function that can be used for any abstract method
function abstractmethod() {throw new Error("abstract method");}

/*
* AbstractSet class defines a single abstract method, contains()
*/
function AbstractSet() {throw new Error("Can't instantiate abstract classes");}
AbstractSet.prototype.contains = abstractmethod;

/*
* NotSet is a concrete subclass of the AbstractSet
*The members of this set are all values that are not members of some other set
*/
var NotSet = AbstractSet.extend(
    function NotSet(set) { this.set = set;},
    {
      contains: function(x) { return !this.set.contains(x); },
      toString: function(x) { return "~" + this.set.toString(); },
      equals: function(that) {
        return that instanceof NotSet && this.set.equals(that.set);
      }

    }
);

/*
* AbstractEnumerableSet is an abstract subclass of the AbstractSet
*/
var AbstractEnumerableSet = AbstractSet.extend(
  function() {throw new Error("Can't instantiate abstract classes");},
  {
    size: abstractmethod,
    foreach: abstractmethod,
    isEmpty: function() { return this.size() == 0; },
    toString: function() {
      var s = "{", i = 0;
      this.foreach(function(v) {
                      if (i++ > 0) s+= ", ";
                      s += v;
                  });
      return s + "}";
    },
    toLocaleString : function() {
      var s = "{", i = 0;
      this.foreach(function(v) {
                      if (i++ > 0) s+= ", ";
                      if(v == null) s += v; // null & undefined
                      else s+= v.toLocaleString(); //all others
                  });
      return s + "}";
    },
    toArray: function(){
      var a = [];
      this.foreach(function(v) a.push(v); });
      return a;
    },
    equals: function(that) {
      if (!(that instanceof AbstractEnumerableSet)) return false;
      //if they don't have the same size, they're not equal
      if(this.size() != that.size()) return false;
      //check whether every element in this is also in that
      try {
        this.foreach(function(v) {if (!that.contains(v)) throw false});
        return true; //All elements matched: sets are equal
      } catch (x) {
        if ( x === false ) return false; //sets are not equal
        throw x; //some other exception occurred: rethrow it
      }
    }
  });

  /*SingletonSet is a concrete subclass of AbstractEnumerableSet
  *It's a read-only set with a single member.
  */
  var SingletonSet = AbstractEnumerableSet.extend(
    function SingletonSet(member) { this.member = member; },
    {
      contains: function(x) { return x === this.member; },
      size: function() { return 1; },
      foreach: function(f,ctx) { f.call(ctx, this.member); }
    }
  );

/*AbstractWritableSet is an abstract class of AbstractEnumerableSet
*
*/
var AbstractWritableSet = AbstractEnumerableSet.extend(
  function() {throw new Error("Can't instantiate abstract classes");},
  {
    add: abstractmethod,
    remove: abstractmethod,
    union: function(that) {
      var self = this;
      that.foreach(function(v) { self.add(v); });
      return this;
    },
    intersection: function(that) {
      var self = this;
      that.foreach(function(v) { if (!that.contains(v)) self.remove(v); });
      return this;
    },
    difference: function(that) {
      var self = this;
      that.foreach(function(v) { self.remove(v); });
      return this;
    }
  }
);

  
