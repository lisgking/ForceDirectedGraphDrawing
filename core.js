//@ sourceMappingURL=core.map
// Generated by CoffeeScript 1.6.1
(function() {
  var C, CANVAS_HEIGHT, CANVAS_WIDTH, Canvas, Edge, GRAB, Graph, K, MU, NATLEN, Node, STEP, canvas, centralGrabx, centralGraby, elecPow, springPow,
    _this = this;

  Graph = (function() {

    function Graph() {
      this.nodes = [];
      this.adj = {};
      this.edges = [];
      this.id_node_dict = {};
    }

    Graph.prototype.addnode = function(node_id, color) {
      var newnode, x, y;
      x = Math.random() * canvas.width;
      y = Math.random() * canvas.height;
      newnode = new Node(node_id, x, y, color);
      this.nodes[node_id] = newnode;
      this.adj[node_id] = new Array();
      return this.id_node_dict[node_id] = newnode;
    };

    Graph.prototype.addedge = function(u, v) {
      if (!(u in this.id_node_dict)) {
        this.addnode(u);
      }
      if (!(v in this.id_node_dict)) {
        this.addnode(v);
      }
      this.adj[u].push(this.id_node_dict[v]);
      this.adj[v].push(this.id_node_dict[u]);
      return this.edges.push(new Edge(this.id_node_dict[u], this.id_node_dict[v]));
    };

    Graph.prototype.draw = function(ctx) {
      var edge, node, _i, _j, _len, _len1, _ref, _ref1, _results;
      _ref = this.edges;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        edge = _ref[_i];
        edge.draw(ctx);
      }
      _ref1 = this.nodes;
      _results = [];
      for (_j = 0, _len1 = _ref1.length; _j < _len1; _j++) {
        node = _ref1[_j];
        _results.push(node.draw(ctx));
      }
      return _results;
    };

    Graph.prototype.move = function() {
      var elecPowVec, node, springPowVec, target, x, y, _i, _j, _k, _len, _len1, _len2, _ref, _ref1, _ref2, _results;
      _ref = this.nodes;
      _results = [];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        node = _ref[_i];
        if (node.binded) {
          continue;
        }
        x = node.posx;
        y = node.posy;
        _ref1 = this.nodes;
        for (_j = 0, _len1 = _ref1.length; _j < _len1; _j++) {
          target = _ref1[_j];
          if (node !== target) {
            elecPowVec = elecPow(node, target);
            node.vx += elecPowVec.x * STEP;
            node.vy += elecPowVec.y * STEP;
          }
        }
        node.vx += centralGrabx(x) * STEP;
        node.vy += centralGraby(y) * STEP;
        _ref2 = this.adj[node.id];
        for (_k = 0, _len2 = _ref2.length; _k < _len2; _k++) {
          target = _ref2[_k];
          springPowVec = springPow(node, target);
          node.vx += springPowVec.x;
          node.vy += springPowVec.y;
        }
        node.vx *= MU;
        node.vy *= MU;
        node.posx += node.vx * STEP;
        _results.push(node.posy += node.vy * STEP);
      }
      return _results;
    };

    return Graph;

  })();

  Node = (function() {

    function Node(id, posx, posy, color) {
      this.id = id;
      this.posx = posx;
      this.posy = posy;
      this.color = color != null ? color : "rgb(0,204,255)";
      this.vx = 0;
      this.vy = 0;
      this.binded = false;
    }

    Node.prototype.draw = function(ctx) {
      ctx.beginPath();
      ctx.fillStyle = this.color;
      ctx.arc(this.posx, this.posy, 10, 0, Math.PI * 2, false);
      return ctx.fill();
    };

    Node.prototype.mouseon = function(e) {
      return Math.sqrt((this.posx - e.x) * (this.posx - e.x) + (this.posy - e.y) * (this.posy - e.y)) < 10;
    };

    return Node;

  })();

  Edge = (function() {

    function Edge(u, v) {
      this.begin = u;
      this.end = v;
    }

    Edge.prototype.draw = function(ctx) {
      var u, v;
      u = this.begin;
      v = this.end;
      ctx.beginPath();
      ctx.strokeStyle = "rgb(100, 100, 100)";
      ctx.moveTo(u.posx, u.posy);
      ctx.lineTo(v.posx, v.posy);
      ctx.closePath();
      return ctx.stroke();
    };

    return Edge;

  })();

  Canvas = (function() {

    function Canvas() {
      var _this = this;
      this.onCanvasMouseup = function(e) {
        return Canvas.prototype.onCanvasMouseup.apply(_this, arguments);
      };
      this.onCanvasMousemove = function(e) {
        return Canvas.prototype.onCanvasMousemove.apply(_this, arguments);
      };
      this.onCanvasMousedown = function(e) {
        return Canvas.prototype.onCanvasMousedown.apply(_this, arguments);
      };
      this.draw = function() {
        return Canvas.prototype.draw.apply(_this, arguments);
      };
      this.timer = {};
      this.graph = new Graph();
      this.width = CANVAS_WIDTH;
      this.height = CANVAS_HEIGHT;
      this.binded = undefined;
    }

    Canvas.prototype.draw = function() {
      var ctx;
      ctx = document.getElementById("maincanvas").getContext("2d");
      ctx.clearRect(0, 0, this.width, this.height);
      this.graph.move();
      return this.graph.draw(ctx);
    };

    Canvas.prototype.resize = function() {
      var height, width;
      width = $(window).width();
      height = $(window).height() - 200;
      $('#maincanvas').attr({
        width: width,
        height: height
      });
      this.width = width;
      return this.height = height;
    };

    Canvas.prototype.getPosition = function(e) {
      var x, y;
      x = e.pageX - $('#maincanvas').position().left;
      y = e.pageY - $('#maincanvas').position().top;
      return {
        x: x,
        y: y
      };
    };

    Canvas.prototype.onCanvasMousedown = function(e) {
      var graph, node, pos, _i, _len, _ref, _results;
      pos = this.getPosition(e);
      graph = this.graph;
      _ref = graph.nodes;
      _results = [];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        node = _ref[_i];
        if (node.mouseon(pos)) {
          this.binded = node;
          node.binded = true;
          console.log(node.id);
          break;
        } else {
          _results.push(void 0);
        }
      }
      return _results;
    };

    Canvas.prototype.onCanvasMousemove = function(e) {
      var pos;
      if (this.binded) {
        pos = this.getPosition(e);
        this.binded.posx = pos.x;
        this.binded.posy = pos.y;
        this.binded.vx = 0;
        return this.binded.vy = 0;
      }
    };

    Canvas.prototype.onCanvasMouseup = function(e) {
      console.log("MOUSE UP");
      this.binded.binded = false;
      return this.binded = undefined;
    };

    Canvas.prototype.changeGraph = function(graphname) {
      var completegraphsize, graph, i, j, nodeside, starsize, _i, _j, _k, _l, _m, _n, _o, _ref;
      clearInterval(this.timer);
      graph = new Graph();
      if (graphname === "star") {
        starsize = 25;
        for (i = _i = 1; 1 <= starsize ? _i < starsize : _i > starsize; i = 1 <= starsize ? ++_i : --_i) {
          graph.addedge(0, i);
        }
      } else if (graphname === "complete") {
        completegraphsize = 5;
        for (i = _j = 0; 0 <= completegraphsize ? _j < completegraphsize : _j > completegraphsize; i = 0 <= completegraphsize ? ++_j : --_j) {
          for (j = _k = _ref = i + 1; _ref <= completegraphsize ? _k < completegraphsize : _k > completegraphsize; j = _ref <= completegraphsize ? ++_k : --_k) {
            graph.addedge(i, j);
          }
        }
      } else if (graphname === "bipartite") {
        nodeside = 3;
        for (i = _l = 0; 0 <= nodeside ? _l < nodeside : _l > nodeside; i = 0 <= nodeside ? ++_l : --_l) {
          for (j = _m = 0; 0 <= nodeside ? _m < nodeside : _m > nodeside; j = 0 <= nodeside ? ++_m : --_m) {
            graph.addedge(i, nodeside + j);
          }
        }
      } else if (graphname === "twostar") {
        starsize = 10;
        for (i = _n = 0; 0 <= starsize ? _n < starsize : _n > starsize; i = 0 <= starsize ? ++_n : --_n) {
          graph.addnode(i, "orange");
          graph.addnode(i + starsize);
        }
        for (i = _o = 1; 1 <= starsize ? _o < starsize : _o > starsize; i = 1 <= starsize ? ++_o : --_o) {
          graph.addedge(0, i);
          graph.addedge(starsize, i + starsize);
        }
        graph.addedge(0, starsize);
      } else {
        console.log("対応するグラフがありません");
      }
      this.graph = graph;
      return this.timer = setInterval(this.draw, 20);
    };

    return Canvas;

  })();

  K = 0.01;

  C = 100000;

  NATLEN = 0;

  STEP = 0.1;

  MU = 0.92;

  GRAB = 0.01;

  springPow = function(node, targetnode) {
    var Fx, Fy, x, y;
    x = node.posx - targetnode.posx;
    y = node.posy - targetnode.posy;
    Fx = -K * x;
    Fy = -K * y;
    return {
      x: Fx,
      y: Fy
    };
  };

  elecPow = function(node, targetnode) {
    var Fx, Fy, r, sgnx, sgny, x, y;
    x = node.posx - targetnode.posx;
    y = node.posy - targetnode.posy;
    sgnx = (x > 0 ? 1 : -1);
    sgny = (y > 0 ? 1 : -1);
    r = x * x + y * y;
    Fx = C * sgnx * Math.abs(x) / (r * Math.sqrt(r) + 10);
    Fy = C * sgny * Math.abs(y) / (r * Math.sqrt(r) + 10);
    return {
      x: Fx,
      y: Fy
    };
  };

  centralGrabx = function(x) {
    return -GRAB * (x - canvas.width / 2);
  };

  centralGraby = function(y) {
    return -GRAB * (y - canvas.height / 2);
  };

  CANVAS_WIDTH = 600;

  CANVAS_HEIGHT = 600;

  canvas = new Canvas();

  $(function() {
    $("#graphselect").change(function() {
      var graphname;
      graphname = $(this).children(":selected").val();
      return canvas.changeGraph(graphname);
    });
    $("#redraw").click(function() {
      var graphname;
      graphname = $("#graphselect").children(":selected").val();
      return canvas.changeGraph(graphname);
    });
    $("#maincanvas").mousemove(canvas.onCanvasMousemove).mousedown(canvas.onCanvasMousedown).mouseup(canvas.onCanvasMouseup);
    canvas.resize();
    return canvas.changeGraph("star");
  });

}).call(this);
