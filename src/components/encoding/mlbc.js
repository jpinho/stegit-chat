module.exports = (function() {
  this.solveConstraints = function(variableCount, constraints, canBeAllZeros) {
    var assignment, propogateConstraints, solve;

    solve = function(variableCount, constraints) {
      var allZero, assignment, backtrack, conflictSet, constraint, current, i, loopLimit, looped, newCurrent, nowBacktracking, satisfies, validBacktracks, variable, _i, _j, _k, _len, _len1, _ref, _ref1;

      satisfies = function(constraint, assignment, current) {
        var element, xor, _i, _len, _ref;

        xor = 0;
        _ref = constraint.elements;
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          element = _ref[_i];
          if (element > current) {
            return true;
          }
          xor = (xor + assignment[element]) % 2;
        }
        return xor === constraint.mustXorTo;
      };
      conflictSet = function(variable) {
        var constraint, element, set, _i, _j, _len, _len1, _ref;

        set = [];
        for (_i = 0, _len = constraints.length; _i < _len; _i++) {
          constraint = constraints[_i];
          if (constraint.elements.indexOf(variable) > -1) {
            _ref = constraint.elements;
            for (_j = 0, _len1 = _ref.length; _j < _len1; _j++) {
              element = _ref[_j];
              if (set.indexOf(element) < 0) {
                set.push(element);
              }
            }
          }
        }
        set.sort(function(x, y) {
          return y - x;
        });
        return set;
      };
      allZero = function(assignment) {
        var i, _i, _ref;

        for (i = _i = 0, _ref = variableCount - 1; 0 <= _ref ? _i <= _ref : _i >= _ref; i = 0 <= _ref ? ++_i : --_i) {
          if (assignment[i] === 1 || assignment[i] === void 0) {
            return false;
          }
        }
        return true;
      };
      assignment = [];
      validBacktracks = [];
      looped = 0;
      loopLimit = 1000000;
      current = 0;
      nowBacktracking = false;
      while (current < variableCount) {
        looped++;
        if (looped > loopLimit) {
          break;
        }
        if ((looped % 500000) === 0) {
          console.log("On our " + looped + "th step while solving");
          console.log("Our current assignment is " + assignment.toString());
        }
        if (assignment[current] === void 0) {
          assignment[current] = Math.floor(Math.random() + 0.5);
          validBacktracks.push(current);
        } else if (nowBacktracking) {
          assignment[current] = (assignment[current] + 1) % 2;
        } else if (!nowBacktracking) {
          validBacktracks.push(current);
        }
        backtrack = false;
        for (_i = 0, _len = constraints.length; _i < _len; _i++) {
          constraint = constraints[_i];
          if (!satisfies(constraint, assignment, current)) {
            backtrack = true;
          }
        }
        if (!canBeAllZeros && allZero(assignment)) {
          backtrack = true;
        }
        if (backtrack) {
          nowBacktracking = true;
          if (validBacktracks.length > 0) {
            newCurrent = -1;
            _ref = conflictSet(current);
            for (_j = 0, _len1 = _ref.length; _j < _len1; _j++) {
              variable = _ref[_j];
              for (i = _k = _ref1 = validBacktracks.length - 1; _ref1 <= 0 ? _k <= 0 : _k >= 0; i = _ref1 <= 0 ? ++_k : --_k) {
                if (variable === validBacktracks[i]) {
                  newCurrent = validBacktracks[i];
                  validBacktracks.splice(i, validBacktracks.length - i);
                  break;
                }
                if (variable > validBacktracks[i]) {
                  break;
                }
              }
              if (newCurrent !== -1) {
                break;
              }
            }
            if (newCurrent === -1) {
              console.log("We have a conflict but there is no conflicting element to change. Give up.");
              return;
            } else {
              current = newCurrent;
            }
          } else {
            console.log("Nowhere to backtrack to and maxOnes is already " + variableCount + " so no assignment is valid");
            return;
          }
        } else {
          nowBacktracking = false;
          current++;
        }
      }
      if (looped > loopLimit) {
        console.log("ERROR: TRYING TO SOLVE SOME MATRIX EQUATION TOOK TOO LONG (NON-MINIMAL)");
        console.log("Our final assignment was " + assignment.toString());
        return;
      }
      console.log("We took " + looped + " loops to solve this.");
      return assignment;
    };
    propogateConstraints = function(constraints) {
      var constrainti, constraintj, count, excOrElements, i, j, k, mustXorTo, newConstraint, newConstraints, temp, _i, _j, _len, _ref, _ref1;

      newConstraints = [];
      count = 0;
      for (i = _i = 0, _len = constraints.length; _i < _len; i = ++_i) {
        constrainti = constraints[i];
        if ((i + 1) <= constraints.length - 1) {
          for (j = _j = _ref = i + 1, _ref1 = constraints.length - 1; _ref <= _ref1 ? _j <= _ref1 : _j >= _ref1; j = _ref <= _ref1 ? ++_j : --_j) {
            constraintj = constraints[j];
            temp = constrainti.elements.concat(constraintj.elements);
            temp = temp.sort(function(x, y) {
              return x - y;
            });
            excOrElements = [];
            k = 0;
            while (k < temp.length - 1) {
              if ((k === temp.length - 1) || (temp[k] !== temp[k + 1])) {
                excOrElements.push(temp[k]);
                k++;
              } else {
                k += 2;
              }
            }
            if ((excOrElements.length <= Math.min(constraintj.elements.length, constrainti.elements.length)) && (excOrElements.length > 0)) {
              mustXorTo = (constrainti.mustXorTo + constraintj.mustXorTo) % 2;
              newConstraint = {
                elements: excOrElements,
                mustXorTo: mustXorTo,
                expandedFrom: [constraintj.elements.length, constrainti.elements.length]
              };
              newConstraints.push(newConstraint);
              count++;
            }
            if (count > 400) {
              break;
            }
          }
        }
        if (count > 400) {
          break;
        }
      }
      return newConstraints.concat(constraints);
    };
    return assignment = solve(variableCount, constraints);
  };

  this.solveConstraintsMinimally = function(variableCount, constraints, canBeAllZeros, minimizeHammingDist) {
    var assignedTo, assignment, constraint, count, element, i, mappedAssignment, solve, variable, variableCountArray, variableInverseMap, variableMap, variablesWithCount, _i, _j, _k, _l, _len, _len1, _len2, _len3, _len4, _len5, _len6, _m, _n, _o, _p, _ref, _ref1, _ref2;

    solve = function(variableCount, constraints) {
      var allZero, assignment, backtrack, constraint, current, currentOnes, i, loopLimit, looped, maxOnes, nowBacktracking, satisfies, validBacktracks, _i, _j, _len, _ref, _ref1;

      satisfies = function(constraint, assignment) {
        var element, xor, _i, _len, _ref;

        xor = 0;
        _ref = constraint.elements;
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          element = _ref[_i];
          if (assignment[element] === void 0) {
            return true;
          }
          xor = (xor + assignment[element]) % 2;
        }
        return xor === constraint.mustXorTo;
      };
      allZero = function(assignment) {
        var i, _i, _ref;

        for (i = _i = 0, _ref = variableCount - 1; 0 <= _ref ? _i <= _ref : _i >= _ref; i = 0 <= _ref ? ++_i : --_i) {
          if (assignment[i] === 1 || assignment[i] === void 0) {
            return false;
          }
        }
        return true;
      };
      assignment = [];
      validBacktracks = [];
      looped = 0;
      loopLimit = 10000000;
      maxOnes = 1;
      currentOnes = 0;
      current = 0;
      nowBacktracking = false;
      while (current < variableCount) {
        looped++;
        if (looped > loopLimit) {
          break;
        }
        if ((looped % 500000) === 0) {
          console.log("On our " + looped + "th step while solving");
          console.log("Our current assignment is " + assignment.toString());
        }
        if (assignment[current] === void 0) {
          if (minimizeHammingDist) {
            assignment[current] = 0;
          } else {
            assignment[current] = Math.floor(Math.random() + 0.5);
            if (assignment[current] === 1) {
              currentOnes++;
            }
          }
          validBacktracks.push(current);
        } else if (nowBacktracking) {
          assignment[current] = (assignment[current] + 1) % 2;
          if (assignment[current] === 1) {
            currentOnes++;
          }
        } else if (!nowBacktracking) {
          console.log("ERRORRR!!!!!! Shouldn't end up in this case");
        }
        backtrack = false;
        for (_i = 0, _len = constraints.length; _i < _len; _i++) {
          constraint = constraints[_i];
          if (!satisfies(constraint, assignment)) {
            backtrack = true;
            break;
          }
        }
        if (!canBeAllZeros && allZero(assignment)) {
          backtrack = true;
        }
        if (minimizeHammingDist && currentOnes > maxOnes) {
          backtrack = true;
        }
        if (backtrack) {
          nowBacktracking = true;
          if (validBacktracks.length > 0) {
            current = validBacktracks.pop();
            if (current + 1 <= variableCount - 1) {
              for (i = _j = _ref = current + 1, _ref1 = variableCount - 1; _ref <= _ref1 ? _j <= _ref1 : _j >= _ref1; i = _ref <= _ref1 ? ++_j : --_j) {
                if (assignment[i] === 1) {
                  currentOnes--;
                }
              }
            }
            assignment.length = current + 1;
          } else {
            if (maxOnes < variableCount) {
              maxOnes++;
              assignment.length = 0;
              current = 0;
              currentOnes = 0;
            } else {
              throw "Nowhere to backtrack to and maxOnes is already " + variableCount + " so no assignment is valid";
              return -1;
            }
          }
        } else {
          nowBacktracking = false;
          current++;
        }
      }
      if (looped > loopLimit) {
        throw "ERROR: TRYING TO SOLVE SOME MATRIX EQUATION TOOK TOO LONG";
        return -1;
      }
      return assignment;
    };
    variableCountArray = [];
    for (i = _i = 0, _ref = variableCount - 1; 0 <= _ref ? _i <= _ref : _i >= _ref; i = 0 <= _ref ? ++_i : --_i) {
      variableCountArray[i] = 0;
    }
    for (_j = 0, _len = constraints.length; _j < _len; _j++) {
      constraint = constraints[_j];
      _ref1 = constraint.elements;
      for (_k = 0, _len1 = _ref1.length; _k < _len1; _k++) {
        element = _ref1[_k];
        variableCountArray[element]++;
      }
    }
    variablesWithCount = [];
    for (i = _l = 0, _len2 = variableCountArray.length; _l < _len2; i = ++_l) {
      count = variableCountArray[i];
      variablesWithCount[i] = {
        variable: i,
        count: count
      };
    }
    variablesWithCount.sort(function(x, y) {
      return y.count - x.count;
    });
    variableInverseMap = variablesWithCount.map(function(varAndCount) {
      return varAndCount.variable;
    });
    variableMap = [];
    for (i = _m = 0, _len3 = variableInverseMap.length; _m < _len3; i = ++_m) {
      variable = variableInverseMap[i];
      variableMap[variable] = i;
    }
    for (_n = 0, _len4 = constraints.length; _n < _len4; _n++) {
      constraint = constraints[_n];
      _ref2 = constraint.elements;
      for (i = _o = 0, _len5 = _ref2.length; _o < _len5; i = ++_o) {
        element = _ref2[i];
        constraint.elements[i] = variableMap[element];
      }
    }
    assignment = solve(variableCount, constraints);
    mappedAssignment = [];
    for (i = _p = 0, _len6 = assignment.length; _p < _len6; i = ++_p) {
      assignedTo = assignment[i];
      mappedAssignment[variableInverseMap[i]] = assignedTo;
    }
    return mappedAssignment;
  };

  this.debug = false;

  this.reduceAxb = function(A, b) {
    var i, i_max, j, k, m, mb, n, nb, swap, _i, _j, _k, _l, _m, _ref, _ref1, _ref2, _ref3, _ref4, _ref5;

    console.log("Asked to row reduce");
    console.log(this.matrixString(A));
    console.log(this.matrixString(b));
    m = this.height(A);
    n = this.width(A);
    mb = this.height(b);
    nb = this.width(b);
    for (k = _i = 0, _ref = m - 1; 0 <= _ref ? _i <= _ref : _i >= _ref; k = 0 <= _ref ? ++_i : --_i) {
      i_max = -1;
      for (i = _j = k, _ref1 = m - 1; k <= _ref1 ? _j <= _ref1 : _j >= _ref1; i = k <= _ref1 ? ++_j : --_j) {
        if (A[i][k] === 1) {
          i_max = i;
        }
      }
      if (i_max === -1) {

      } else {
        swap = A[i_max].slice(0);
        A[i_max] = A[k];
        A[k] = swap;
        swap = b[i_max].slice(0);
        b[i_max] = b[k];
        b[k] = swap;
        if (k + 1 <= m - 1) {
          for (i = _k = _ref2 = k + 1, _ref3 = m - 1; _ref2 <= _ref3 ? _k <= _ref3 : _k >= _ref3; i = _ref2 <= _ref3 ? ++_k : --_k) {
            if (A[i][k] === 1) {
              for (j = _l = 0, _ref4 = n - 1; 0 <= _ref4 ? _l <= _ref4 : _l >= _ref4; j = 0 <= _ref4 ? ++_l : --_l) {
                A[i][j] = (A[i][j] + A[k][j]) % 2;
              }
              for (j = _m = 0, _ref5 = nb - 1; 0 <= _ref5 ? _m <= _ref5 : _m >= _ref5; j = 0 <= _ref5 ? ++_m : --_m) {
                b[i][j] = (b[i][j] + b[k][j]) % 2;
              }
            }
          }
        }
      }
    }
    console.log("Finished row reducing!");
    console.log(this.matrixString(A));
    console.log(this.matrixString(b));
    return {
      A: A,
      b: b
    };
  };

  this.width = function(m) {
    return m[0].length;
  };

  this.height = function(m) {
    return m.length;
  };

  this.multiplyMatrices = function(m1, m2) {
    var m, m1column, m1row, m2column, _i, _j, _k, _ref, _ref1, _ref2;

    if (width(m1) !== height(m2)) {
      console.log("Dimentions don't match in multiplication");
    }
    m = this.newMatrix(height(m1), width(m2));
    for (m2column = _i = 0, _ref = width(m2) - 1; 0 <= _ref ? _i <= _ref : _i >= _ref; m2column = 0 <= _ref ? ++_i : --_i) {
      for (m1row = _j = 0, _ref1 = height(m1) - 1; 0 <= _ref1 ? _j <= _ref1 : _j >= _ref1; m1row = 0 <= _ref1 ? ++_j : --_j) {
        for (m1column = _k = 0, _ref2 = width(m1) - 1; 0 <= _ref2 ? _k <= _ref2 : _k >= _ref2; m1column = 0 <= _ref2 ? ++_k : --_k) {
          m[m1row][m2column] = ((m1[m1row][m1column] * m2[m1column][m2column]) + m[m1row][m2column]) % 2;
        }
      }
    }
    return m;
  };

  this.multiplyMatricesAtPos = function(m1, m2, row, col) {
    var m1column, result, _i, _ref;

    result = 0;
    for (m1column = _i = 0, _ref = width(m1) - 1; 0 <= _ref ? _i <= _ref : _i >= _ref; m1column = 0 <= _ref ? ++_i : --_i) {
      result = (result + (m1[row][m1column] * m2[m1column][col])) % 2;
    }
    return result;
  };

  this.addMatrices = function(m1, m2) {
    var column, m, row, _i, _j, _ref, _ref1;

    if (width(m1) !== width(m2) || height(m1) !== height(m2)) {
      console.log("Dimentions don't match in addition");
    }
    m = this.newMatrix(height(m1), width(m1));
    for (row = _i = 0, _ref = height(m1) - 1; 0 <= _ref ? _i <= _ref : _i >= _ref; row = 0 <= _ref ? ++_i : --_i) {
      for (column = _j = 0, _ref1 = width(m1) - 1; 0 <= _ref1 ? _j <= _ref1 : _j >= _ref1; column = 0 <= _ref1 ? ++_j : --_j) {
        m[row][column] = (m1[row][column] + m2[row][column]) % 2;
      }
    }
    return m;
  };

  this.scale = function(m, factor) {
    var block, row, _i, _len, _results;

    if (isNaN(factor)) {
      console.log("Factor is invalid");
    }
    _results = [];
    for (_i = 0, _len = m.length; _i < _len; _i++) {
      row = m[_i];
      _results.push((function() {
        var _j, _len1, _results1;

        _results1 = [];
        for (_j = 0, _len1 = row.length; _j < _len1; _j++) {
          block = row[_j];
          _results1.push(block = block * factor);
        }
        return _results1;
      })());
    }
    return _results;
  };

  this.identity = function(n) {
    var i, m, _i, _ref;

    m = this.newMatrix(n, n);
    for (i = _i = 0, _ref = n - 1; 0 <= _ref ? _i <= _ref : _i >= _ref; i = 0 <= _ref ? ++_i : --_i) {
      m[i][i] = 1;
    }
    return m;
  };

  this.newMatrix = function(height, width) {
    var block, m, row, _i, _len, _results;

    m = new Array(height);
    _results = [];
    for (_i = 0, _len = m.length; _i < _len; _i++) {
      row = m[_i];
      row = new Array(width);
      _results.push((function() {
        var _j, _len1, _results1;

        _results1 = [];
        for (_j = 0, _len1 = row.length; _j < _len1; _j++) {
          block = row[_j];
          _results1.push(block = 0);
        }
        return _results1;
      })());
    }
    return _results;
  };

  this.newRandomMatrix = function(height, width) {
    return this.newWeightedRandomMatrix(height, width, 0.5);
  };

  this.newWeightedRandomMatrix = function(height, width, p) {
    var block, m, row, _i, _len, _results;

    m = this.newMatrix(height, width);
    _results = [];
    for (_i = 0, _len = m.length; _i < _len; _i++) {
      row = m[_i];
      _results.push((function() {
        var _j, _len1, _results1;

        _results1 = [];
        for (_j = 0, _len1 = row.length; _j < _len1; _j++) {
          block = row[_j];
          _results1.push(block = this.binaryRandom(p));
        }
        return _results1;
      }).call(this));
    }
    return _results;
  };

  this.binaryRandom = function(p) {
    return Math.floor(Math.random() + p);
  };

  this.matrixString = function(m) {
    var block, buff, row, _i, _j, _len, _len1;

    buff = "";
    for (_i = 0, _len = m.length; _i < _len; _i++) {
      row = m[_i];
      for (_j = 0, _len1 = row.length; _j < _len1; _j++) {
        block = row[_j];
        buff += block + "  ";
      }
      buff += "\n";
    }
    return buff.substr(0, buff.length - 1);
  };

  this.transpose = function(m) {
    var columnIndex, mTrans, rowIndex, _i, _j, _ref, _ref1;

    mTrans = this.newMatrix(width(m), height(m));
    for (rowIndex = _i = 0, _ref = height(m) - 1; 0 <= _ref ? _i <= _ref : _i >= _ref; rowIndex = 0 <= _ref ? ++_i : --_i) {
      for (columnIndex = _j = 0, _ref1 = width(m) - 1; 0 <= _ref1 ? _j <= _ref1 : _j >= _ref1; columnIndex = 0 <= _ref1 ? ++_j : --_j) {
        mTrans[columnIndex][rowIndex] = m[rowIndex][columnIndex];
      }
    }
    return mTrans;
  };

  this.horisontalJoin = function(m1, m2) {
    var m, m1ColumnIndex, m2ColumnIndex, rowIndex, _i, _j, _k, _ref, _ref1, _ref2;

    if (height(m1) !== height(m2)) {
      console.log("Dimentions don't match in horisontal join");
    }
    m = this.newMatrix(height(m1), width(m1) + width(m2));
    for (rowIndex = _i = 0, _ref = height(m1) - 1; 0 <= _ref ? _i <= _ref : _i >= _ref; rowIndex = 0 <= _ref ? ++_i : --_i) {
      for (m1ColumnIndex = _j = 0, _ref1 = width(m1) - 1; 0 <= _ref1 ? _j <= _ref1 : _j >= _ref1; m1ColumnIndex = 0 <= _ref1 ? ++_j : --_j) {
        m[rowIndex][m1ColumnIndex] = m1[rowIndex][m1ColumnIndex];
      }
      for (m2ColumnIndex = _k = 0, _ref2 = width(m2) - 1; 0 <= _ref2 ? _k <= _ref2 : _k >= _ref2; m2ColumnIndex = 0 <= _ref2 ? ++_k : --_k) {
        m[rowIndex][m2ColumnIndex + width(m1)] = m2[rowIndex][m2ColumnIndex];
      }
    }
    return m;
  };

  this.verticalJoin = function(m1, m2) {
    var columnIndex, m, m1RowIndex, m2RowIndex, _i, _j, _k, _ref, _ref1, _ref2;

    if (width(m1) !== width(m2)) {
      console.log("Dimentions don't match in vertical join");
    }
    m = this.newMatrix(height(m1) + height(m2), width(m1));
    for (columnIndex = _i = 0, _ref = width(m1) - 1; 0 <= _ref ? _i <= _ref : _i >= _ref; columnIndex = 0 <= _ref ? ++_i : --_i) {
      for (m1RowIndex = _j = 0, _ref1 = height(m1) - 1; 0 <= _ref1 ? _j <= _ref1 : _j >= _ref1; m1RowIndex = 0 <= _ref1 ? ++_j : --_j) {
        m[m1RowIndex][columnIndex] = m1[m1RowIndex][columnIndex];
      }
      for (m2RowIndex = _k = 0, _ref2 = height(m2) - 1; 0 <= _ref2 ? _k <= _ref2 : _k >= _ref2; m2RowIndex = 0 <= _ref2 ? ++_k : --_k) {
        m[m2RowIndex + height(m1)][columnIndex] = m2[m2RowIndex][columnIndex];
      }
    }
    return m;
  };

  this.equalMatrix = function(m1, m2) {
    var rowIndex, _i, _ref;

    if (width(m1) !== width(m2) || height(m1) !== height(m2)) {
      return false;
    }
    for (rowIndex = _i = 0, _ref = height(m1) - 1; 0 <= _ref ? _i <= _ref : _i >= _ref; rowIndex = 0 <= _ref ? ++_i : --_i) {
      if (!equalVector(m1[rowIndex], m2[rowIndex])) {
        return false;
      }
    }
    return true;
  };

  this.equalVector = function(v1, v2) {
    return v1.join() === v2.join();
  };

  this.columnRank = function(m) {
    return this.rowRank(this.transpose(m));
  };

  this.rowRank = function(m) {
    var nrows, rank, rowIndex, seen, _i, _ref;

    rank = 0;
    nrows = this.height(m);
    seen = new Array();
    for (rowIndex = _i = 0, _ref = nrows - 1; 0 <= _ref ? _i <= _ref : _i >= _ref; rowIndex = 0 <= _ref ? ++_i : --_i) {
      if (seen[m[rowIndex].join()] === void 0) {
        seen[m[rowIndex].join()] = true;
        rank++;
      }
    }
    return rank;
  };

  this.hammingWeight = function(m) {
    var block, count, row, _i, _j, _len, _len1;

    count = 0;
    for (_i = 0, _len = m.length; _i < _len; _i++) {
      row = m[_i];
      for (_j = 0, _len1 = row.length; _j < _len1; _j++) {
        block = row[_j];
        if (block === 1) {
          count++;
        }
      }
    }
    return count;
  };

  this.allVectors = function(n) {
    var count, i, j, vectors, _i, _j, _ref, _ref1;

    if (this.allVectors.cached === void 0) {
      this.allVectors.cached = [];
    }
    if (this.allVectors.cached[n] !== void 0) {
      return this.allVectors.cached[n];
    }
    vectors = [];
    if (n === 0) {
      return vectors;
    }
    vectors[0] = [0];
    vectors[1] = [1];
    if (n === 1) {
      return vectors;
    }
    for (i = _i = 0, _ref = n - 2; 0 <= _ref ? _i <= _ref : _i >= _ref; i = 0 <= _ref ? ++_i : --_i) {
      count = vectors.length;
      for (j = _j = 0, _ref1 = count - 1; 0 <= _ref1 ? _j <= _ref1 : _j >= _ref1; j = 0 <= _ref1 ? ++_j : --_j) {
        vectors[j + count] = vectors[j].slice(0);
        vectors[j].push(0);
        vectors[j + count].push(1);
      }
    }
    this.allVectors.cached[n] = vectors;
    return vectors;
  };

  this.allVectorsWithMaxHammingDist = function(n, h) {
    var count, i, j, offset, vectors, _i, _j, _ref, _ref1;

    if (this.allVectorsWithMaxHammingDist.cache === void 0) {
      this.allVectorsWithMaxHammingDist.cache = [];
    }
    if (this.allVectorsWithMaxHammingDist.cache[n] === void 0) {
      this.allVectorsWithMaxHammingDist.cache[n] = [];
    }
    if (this.allVectorsWithMaxHammingDist.cache[n][h] !== void 0) {
      return this.allVectorsWithMaxHammingDist.cache[n][h];
    }
    vectors = [];
    if (n === 0) {
      return vectors;
    }
    vectors[0] = [0];
    vectors[0].dist = 0;
    vectors[1] = [1];
    vectors[1].dist = 1;
    if (n === 1) {
      return vectors;
    }
    for (i = _i = 0, _ref = n - 2; 0 <= _ref ? _i <= _ref : _i >= _ref; i = 0 <= _ref ? ++_i : --_i) {
      offset = 0;
      count = vectors.length;
      for (j = _j = 0, _ref1 = count - 1; 0 <= _ref1 ? _j <= _ref1 : _j >= _ref1; j = 0 <= _ref1 ? ++_j : --_j) {
        if (vectors[j].dist < h) {
          vectors[j + count - offset] = vectors[j].slice(0);
          vectors[j + count - offset].dist = vectors[j].dist;
          vectors[j + count - offset].push(1);
          vectors[j + count - offset].dist++;
        } else {
          offset++;
        }
        vectors[j].push(0);
      }
    }
    this.allVectorsWithMaxHammingDist.cache[n][h] = vectors;
    return vectors;
  };

  this.allSparceVectorsWithMaxOnes = function(n, maxOnes) {
    var count, currentLength, i, j, offset, vectors, _i, _j, _ref, _ref1;

    if (n === 0) {
      return [];
    }
    vectors = [[], [0]];
    if (n === 1) {
      return vectors;
    }
    currentLength = 1;
    for (i = _i = 0, _ref = n - 2; 0 <= _ref ? _i <= _ref : _i >= _ref; i = 0 <= _ref ? ++_i : --_i) {
      offset = 0;
      count = vectors.length;
      for (j = _j = 0, _ref1 = count - 1; 0 <= _ref1 ? _j <= _ref1 : _j >= _ref1; j = 0 <= _ref1 ? ++_j : --_j) {
        if (vectors[j].length < maxOnes) {
          vectors[j + count - offset] = vectors[j].slice(0);
          vectors[j + count - offset].push(currentLength);
        } else {
          offset++;
        }
      }
      currentLength++;
    }
    return vectors;
  };

  this.sparceVectorToVector = function(vector, vectorLength) {
    var current, i, newVector, _i, _ref;

    newVector = [];
    current = 0;
    for (i = _i = 0, _ref = vectorLength - 1; 0 <= _ref ? _i <= _ref : _i >= _ref; i = 0 <= _ref ? ++_i : --_i) {
      if (vector[current] === i) {
        newVector.push(1);
        current++;
      } else {
        newVector.push(0);
      }
    }
    return newVector;
  };

  this.allColumnsWithMaxHammingDist = function(n, h) {
    return allVectorsWithMaxHammingDist(n, h).map(function(vector) {
      var z;

      z = [];
      z.push(vector);
      return z;
    });
  };

  this.allColumns = function(n) {
    return allVectors(n).map(function(vector) {
      var z;

      z = [];
      z.push(vector);
      return z;
    });
  };

  this.minimizeWetBits = function(G0, stream, origMessage) {
    var bestVector, column, matrix, messageToSend, minFailCount, result, stuckBits, stuckFailCount, vector, vectors, _i, _j, _len, _ref;

    vectors = this.allVectorsWithMaxHammingDist(this.height(G0), this.height(G0));
    minFailCount = 9999999;
    stuckBits = this.width(stream) - this.hammingWeight(stream);
    for (_i = 0, _len = vectors.length; _i < _len; _i++) {
      vector = vectors[_i];
      matrix = [vector];
      messageToSend = this.addMatrices(this.multiplyMatrices(matrix, G0), origMessage);
      stuckFailCount = 0;
      for (column = _j = 0, _ref = this.width(stream) - 1; 0 <= _ref ? _j <= _ref : _j >= _ref; column = 0 <= _ref ? ++_j : --_j) {
        if (stream[0][column] === 0) {
          if (messageToSend[0][column] !== 0) {
            stuckFailCount++;
          }
        }
      }
      if (stuckFailCount < minFailCount) {
        minFailCount = stuckFailCount;
        bestVector = vector;
        if (minFailCount === 0) {
          break;
        }
      }
    }
    console.log("Best we can do is have " + minFailCount + " stuck bits remaining from a starting " + stuckBits);
    result = this.addMatrices(this.multiplyMatrices([bestVector], G0), origMessage);
    console.log("origMessage: " + origMessage.toString() + ", stream: " + stream.toString() + ", result: " + result.toString());
    return result;
  };

  this.solveMatrixEquations = function(arr) {
    var A, At, B, Bt, assignedVariable, atHeight, clone, column, constraint, constraints, correct, equation, i, row, x, xt, xtAsVector, xtColARow, xtHeight, xtWidth, _i, _j, _k, _l, _len, _len1, _len2, _m, _n, _o, _ref, _ref1, _ref2, _ref3;

    clone = function(obj) {
      var flags, key, newInstance;

      if ((obj == null) || typeof obj !== 'object') {
        return obj;
      }
      if (obj instanceof Date) {
        return new Date(obj.getTime());
      }
      if (obj instanceof RegExp) {
        flags = '';
        if (obj.global != null) {
          flags += 'g';
        }
        if (obj.ignoreCase != null) {
          flags += 'i';
        }
        if (obj.multiline != null) {
          flags += 'm';
        }
        if (obj.sticky != null) {
          flags += 'y';
        }
        return new RegExp(obj.source, flags);
      }
      newInstance = new obj.constructor();
      for (key in obj) {
        newInstance[key] = clone(obj[key]);
      }
      return newInstance;
    };
    if (arr.length === 0) {
      console.log("ERROR: ASKED TO SOLVE NO EQUATIONS");
    }
    constraints = [];
    for (_i = 0, _len = arr.length; _i < _len; _i++) {
      equation = arr[_i];
      A = equation.A;
      B = equation.B;
      At = this.transpose(A);
      Bt = this.transpose(B);
      if (atHeight === void 0) {
        atHeight = this.height(At);
      } else if (atHeight !== this.height(At)) {
        console.log("Matrices asked to solve are the wrong dimention");
        return;
      }
      if (xt === void 0) {
        xt = [];
        xtHeight = this.height(Bt);
        xtWidth = this.height(At);
        for (row = _j = 0, _ref = xtHeight - 1; 0 <= _ref ? _j <= _ref : _j >= _ref; row = 0 <= _ref ? ++_j : --_j) {
          xt[row] = [];
        }
      }
      for (row = _k = 0, _ref1 = xtHeight - 1; 0 <= _ref1 ? _k <= _ref1 : _k >= _ref1; row = 0 <= _ref1 ? ++_k : --_k) {
        for (column = _l = 0, _ref2 = this.width(At) - 1; 0 <= _ref2 ? _l <= _ref2 : _l >= _ref2; column = 0 <= _ref2 ? ++_l : --_l) {
          constraint = {
            elements: [],
            mustXorTo: Bt[row][column]
          };
          for (xtColARow = _m = 0, _ref3 = this.height(At) - 1; 0 <= _ref3 ? _m <= _ref3 : _m >= _ref3; xtColARow = 0 <= _ref3 ? ++_m : --_m) {
            if (At[xtColARow][column] === 1) {
              constraint.elements.push(xtColARow + row * xtWidth);
            }
          }
          if (constraint.elements.length > 0) {
            constraints.push(constraint);
          }
        }
      }
    }
    xtAsVector = this.solveConstraints(xtWidth * xtHeight, constraints, false);
    for (i = _n = 0, _len1 = xtAsVector.length; _n < _len1; i = ++_n) {
      assignedVariable = xtAsVector[i];
      row = Math.floor(i / xtWidth);
      column = i % xtWidth;
      xt[row][column] = assignedVariable;
    }
    x = this.transpose(xt);
    correct = true;
    for (_o = 0, _len2 = arr.length; _o < _len2; _o++) {
      equation = arr[_o];
      A = equation.A;
      B = equation.B;
      if (!this.equalMatrix(this.multiplyMatrices(A, x), B)) {
        correct = false;
        break;
      }
    }
    if (correct === false) {
      return console.log("OUR SOLVER WENT WRONG");
    } else {
      return x;
    }
  };

  this.solveMatrixEquation = function(A, B) {
    return this.solveMatrixEquations([
      {
        A: A,
        B: B
      }
    ]);
  };

  this.newRandomMLBC = function(n, k, l, stats) {
    var G, G0, G1, Ht, Jt, count, mlbcStats, r, t, u, valid;

    this.debugOutput("This is an " + "(" + n + ", " + k + ", " + l + ") code with sending rate " + k / n);
    r = n - k - l;
    if ((2 ^ r) > n) {
      this.debugOutput("Increase n or decrease k or decrease l. You can't make H full rank with this.");
      return {
        success: false
      };
    }
    valid = false;
    count = 0;
    while (valid !== true) {
      G0 = this.newRandomMatrix(l, n);
      G1 = this.newRandomMatrix(k, n);
      G = this.verticalJoin(G0, G1);
      Ht = this.solveMatrixEquation(G, this.newMatrix(k + l, r));
      Jt = this.solveMatrixEquations([
        {
          A: G0,
          B: this.newMatrix(l, k)
        }, {
          A: G1,
          B: this.identity(k)
        }
      ]);
      valid = this.verifyMLBCCorrectness(G, G0, G1, Ht, Jt, n, k, l, r);
      count++;
      if ((count % 10000) === 0) {
        console.log("Now tried " + count + " sets of matrices");
      }
      if (count > 10000) {
        this.debugOutput("We tried over 10000. Giving up.");
        return {
          success: false
        };
      }
    }
    this.debugOutput("Attempted " + count + " sets of matrices to generate full-rank H");
    this.debugOutput("G1:");
    this.debugOutput(matrixString(G1));
    this.debugOutput("G0:");
    this.debugOutput(matrixString(G0));
    this.debugOutput("H^t:");
    this.debugOutput(matrixString(Ht));
    this.debugOutput("J^t:");
    this.debugOutput(matrixString(Jt));
    if (stats) {
      mlbcStats = this.mlbcStats(G0, Ht);
      u = mlbcStats.u;
      t = mlbcStats.t;
      console.log("This code can fix any " + u + " (" + Math.round((u * 100 / n) * 10) / 10 + "%) error(s) and withstand any " + t + " (" + Math.round((t * 100 / n) * 10) / 10 + "%) stuck bit(s)");
    }
    return {
      success: true,
      k: k,
      n: n,
      r: r,
      l: l,
      G1: G1,
      Ht: Ht,
      Jt: Jt,
      G0: G0,
      u: u,
      t: t
    };
  };

  this.newMLBC = function(n, k, l, stats) {
    var G, G0, G1, H, Ht, Ik, Il, Ir, J, Jt, P, Pt, Q, QplusRPt, R, RP, Rt, count, goodHeuristic, hRank, kZerosVector, mlbcStats, r, t, u, zeroskl, zeroskr;

    this.debugOutput("This is an " + "(" + n + ", " + k + ", " + l + ") code with sending rate " + k / n);
    r = n - k - l;
    if ((2 ^ r) > n) {
      this.debugOutput("Increase n or decrease k or decrease l. You can't make H full rank with this.");
      return {
        success: false
      };
    }
    goodHeuristic = false;
    count = 0;
    while (goodHeuristic !== true) {
      R = this.newWeightedRandomMatrix(l, k, 0.5);
      Q = this.newWeightedRandomMatrix(l, r, 0.5);
      Ik = this.identity(k);
      zeroskl = this.newMatrix(k, l);
      P = this.newRandomMatrix(k, r);
      G1 = this.horisontalJoin(this.horisontalJoin(Ik, zeroskl), P);
      Il = this.identity(l);
      G0 = this.horisontalJoin(this.horisontalJoin(R, Il), Q);
      Pt = this.transpose(P);
      RP = this.multiplyMatrices(R, P);
      QplusRPt = this.transpose(this.addMatrices(Q, RP));
      Ir = this.identity(r);
      H = this.horisontalJoin(this.horisontalJoin(Pt, QplusRPt), Ir);
      hRank = this.columnRank(H);
      kZerosVector = this.newMatrix(1, k);
      goodHeuristic = hRank === n;
      count++;
      if ((count % 10000) === 0) {
        console.log("Now tried " + count + " sets of matrices");
      }
      if (count > 100000) {
        this.debugOutput("We tried over 100000. Giving up.");
        return {
          success: false
        };
      }
    }
    this.debugOutput("Attempted " + count + " sets of matrices to generate full-rank H");
    this.debugOutput("G1:");
    this.debugOutput(matrixString(G1));
    this.debugOutput("G0:");
    this.debugOutput(matrixString(G0));
    this.debugOutput("H:");
    this.debugOutput(matrixString(H));
    Ik = this.identity(k);
    Rt = this.transpose(R);
    zeroskr = this.newMatrix(k, r);
    J = this.horisontalJoin(this.horisontalJoin(Ik, Rt), zeroskr);
    this.debugOutput("J:");
    this.debugOutput(matrixString(J));
    G = this.verticalJoin(G0, G1);
    Ht = this.transpose(H);
    Jt = this.transpose(J);
    if (!this.verifyMLBCCorrectness(G, G0, G1, Ht, Jt, n, k, l, r)) {
      console.log("MLBC is invalid");
    }
    if (!stats) {
      return {
        success: true,
        k: k,
        n: n,
        l: l,
        r: r,
        G1: G1,
        Ht: Ht,
        Jt: Jt,
        G0: G0
      };
    } else {
      mlbcStats = this.mlbcStats(G0, Ht);
      u = mlbcStats.u;
      t = mlbcStats.t;
      console.log("This code can fix any " + u + " (" + Math.round((u * 100 / n) * 10) / 10 + "%) error(s) and withstand any " + t + " (" + Math.round((t * 100 / n) * 10) / 10 + "%) stuck bit(s)");
      return {
        success: true,
        u: u,
        t: t,
        k: k,
        n: n,
        l: l,
        r: r,
        G1: G1,
        Ht: Ht,
        Jt: Jt,
        G0: G0
      };
    }
  };

  this.mlbcStats = function(G0, Ht) {
    var G0t, column, constraint, constraints, d0, d1, row, t, u, x, _i, _j, _k, _l, _ref, _ref1, _ref2, _ref3;

    G0t = this.transpose(G0);
    constraints = [];
    for (column = _i = 0, _ref = this.width(G0t) - 1; 0 <= _ref ? _i <= _ref : _i >= _ref; column = 0 <= _ref ? ++_i : --_i) {
      constraint = {
        elements: [],
        mustXorTo: 0
      };
      for (row = _j = 0, _ref1 = this.height(G0t) - 1; 0 <= _ref1 ? _j <= _ref1 : _j >= _ref1; row = 0 <= _ref1 ? ++_j : --_j) {
        if (G0t[row][column] === 1) {
          constraint.elements.push(row);
        }
      }
      constraints.push(constraint);
    }
    x = this.solveConstraintsMinimally(this.height(G0t), constraints, false, true);
    d0 = this.hammingWeight([x]);
    constraints = [];
    for (column = _k = 0, _ref2 = this.width(Ht) - 1; 0 <= _ref2 ? _k <= _ref2 : _k >= _ref2; column = 0 <= _ref2 ? ++_k : --_k) {
      constraint = {
        elements: [],
        mustXorTo: 0
      };
      for (row = _l = 0, _ref3 = this.height(Ht) - 1; 0 <= _ref3 ? _l <= _ref3 : _l >= _ref3; row = 0 <= _ref3 ? ++_l : --_l) {
        if (Ht[row][column] === 1) {
          constraint.elements.push(row);
        }
      }
      constraints.push(constraint);
    }
    x = this.solveConstraintsMinimally(this.height(Ht), constraints, false, true);
    d1 = this.hammingWeight([x]);
    t = Math.max(d0 - 1, 0);
    u = Math.floor(d1 / 2 - 0.5);
    return {
      u: u,
      t: t
    };
  };

  this.verifyMLBCCorrectness = function(G, G0, G1, Ht, Jt, n, k, l, r) {
    var correct;

    correct = true;
    this.debugOutput("Now we verify the various requirements of the code");
    if (!this.equalMatrix(this.multiplyMatrices(G0, Jt), this.newMatrix(l, k))) {
      this.debugOutput("ERROR: G0 * Jt != 0");
      correct = false;
    } else {
      this.debugOutput("G0 * Jt == 0");
    }
    if (!this.equalMatrix(this.multiplyMatrices(G1, Jt), this.identity(k))) {
      this.debugOutput("ERROR: G1 * Jt != Ik");
      correct = false;
    } else {
      this.debugOutput("G1 * Jt == Ik");
    }
    if (!this.equalMatrix(this.multiplyMatrices(G, Ht), this.newMatrix(k + l, r))) {
      this.debugOutput("ERROR: G * Ht != 0");
      correct = false;
    } else {
      this.debugOutput("G * Ht == 0");
    }
    if (this.rowRank(G) !== (k + l)) {
      correct = false;
      this.debugOutput("G's rank is too small (rank: " + this.rowRank(G) + ", goal: " + (k + l) + ")");
    } else {
      this.debugOutput("RowRank(G) == " + this.rowRank(G));
    }
    return correct;
  };

  this.oldTest = function(mlbc) {
    var G0t, Hwx, allZeros, current, d0, d1, lZerosVector, rZerosVector, t, u, vector, x, _i, _len, _ref;

    console.log("Running our old tests");
    d1 = 99999999;
    d0 = 99999999;
    G0t = this.transpose(mlbc.G0);
    rZerosVector = this.newMatrix(1, mlbc.r);
    lZerosVector = this.newMatrix(1, mlbc.l);
    current = 1;
    while (current < Math.min(mlbc.n, Math.max(d0, d1))) {
      this.debugOutput("current: " + current + " d0: " + d0 + " d1: " + d1);
      allZeros = true;
      _ref = allSparceVectorsWithMaxOnes(mlbc.n, current);
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        vector = _ref[_i];
        x = [this.sparceVectorToVector(vector, mlbc.n)];
        if (!allZeros) {
          Hwx = current;
          if (Hwx < d1) {
            if (this.equalMatrix(this.multiplyMatrices(x, mlbc.Ht), rZerosVector)) {
              d1 = Math.min(Hwx, d1);
            }
          }
          if (Hwx < d0) {
            if (this.equalMatrix(this.multiplyMatrices(x, G0t), lZerosVector)) {
              d0 = Math.min(Hwx, d0);
            }
          }
          if ((d0 === 0) && (d1 === 1)) {
            break;
          }
        } else {
          allZeros = false;
        }
      }
      current++;
    }
    u = Math.floor(d1 / 2 - 0.5);
    t = Math.max(d0 - 1, 0);
    console.log("This code can fix any " + u + " error(s), aka withstand up to " + Math.round((u * 100 / mlbc.n) * 10) / 10 + "% error rate");
    return console.log("This code can withstand any " + t + " stuck bit(s), aka withstand up to " + Math.round((t * 100 / mlbc.n) * 10) / 10 + "% wet rate");
  };

  this.toBin = function(str) {
    var arr, d, i, j, len, st, _i, _j, _ref;

    arr = [];
    len = str.length;
    for (i = _i = 1; 1 <= len ? _i <= len : _i >= len; i = 1 <= len ? ++_i : --_i) {
      d = str.charCodeAt(len - i);
      for (j = _j = 0; _j <= 7; j = ++_j) {
        st = (_ref = d % 2 === '0') != null ? _ref : {
          "class='zero'": ""
        };
        arr.push(d % 2);
        d = Math.floor(d / 2);
      }
    }
    return arr.reverse();
  };

  this.toStr = function(bin) {
    var ascii_string, current_byte, i, to, _i;

    ascii_string = '';
    if (bin.length % 8 !== 0) {
      return 'Binary length is not divisible by eight.';
    } else {
      to = (bin.length / 8) - 1;
      for (i = _i = 0; 0 <= to ? _i <= to : _i >= to; i = 0 <= to ? ++_i : --_i) {
        current_byte = bin.slice(i * 8, (i * 8) + 8).join('');
        ascii_string += String.fromCharCode(parseInt(current_byte, 2));
      }
      return ascii_string;
    }
  };

  this.decodeLongMessage = function(MLBC, stream) {
    var bitTotal, blockIndex, decodedBinary, decodedBinaryInCode, decodedBinaryPart, decodedBinaryPartInCode, encodedMessage, i, lastDecodedBlockEnd, lastDecodedChar, messageBlocks, messageSoFar, _i, _j, _ref, _ref1;

    console.log(MLBC);
    lastDecodedChar = void 0;
    decodedBinaryInCode = [];
    i = 0;
    while (lastDecodedChar !== "`" && stream.length > MLBC.n) {
      encodedMessage = stream.splice(0, MLBC.n);
      decodedBinaryPartInCode = this.decodeMessage(MLBC, [encodedMessage])[0];
      decodedBinaryInCode = decodedBinaryInCode.concat(decodedBinaryPartInCode);
      decodedBinary = [];
      if (0 < Math.floor(decodedBinaryInCode.length / 3) - 1) {
        for (blockIndex = _i = 0, _ref = Math.floor(decodedBinaryInCode.length / 3) - 1; 0 <= _ref ? _i <= _ref : _i >= _ref; blockIndex = 0 <= _ref ? ++_i : --_i) {
          bitTotal = decodedBinaryInCode[blockIndex * 3] + decodedBinaryInCode[blockIndex * 3 + 1] + decodedBinaryInCode[blockIndex * 3 + 2];
          console.log("Received " + Math.floor(bitTotal / 3 + 0.5) + " from " + decodedBinaryInCode[blockIndex * 3] + "" + decodedBinaryInCode[blockIndex * 3 + 1] + "" + decodedBinaryInCode[blockIndex * 3 + 2]);
          decodedBinary.push(Math.floor(bitTotal / 3 + 0.5));
        }
      }
      console.log(decodedBinary.toString());
      lastDecodedBlockEnd = 8 * Math.floor(decodedBinary.length / 8) - 1;
      if (lastDecodedBlockEnd > 0) {
        messageSoFar = this.toStr(decodedBinary.slice(0, +lastDecodedBlockEnd + 1 || 9e9));
        console.log(messageSoFar);
        lastDecodedChar = messageSoFar[messageSoFar.length - 1];
        if (lastDecodedChar !== "`" && isNaN(parseInt(lastDecodedChar))) {
          console.log("The header is corrupt or there is nothing there.");
          return;
        }
      }
      if (i > 1000) {
        console.log("The header is corrupt or there is nothing here.");
        return;
      }
      i++;
    }
    if (stream.length < MLBC.n && lastDecodedChar !== "`") {
      console.log("The header was corrupt. We reached the end of the stream without seeing `.");
      return;
    }
    messageBlocks = parseInt(messageSoFar.slice(0, +(messageSoFar.length - 2) + 1 || 9e9));
    if (isNaN(messageBlocks)) {
      console.log("The header was corrupt. Fail.");
      return;
    } else {
      console.log("The message is " + messageBlocks + " long");
    }
    decodedBinary = [];
    for (i = _j = 0, _ref1 = messageBlocks - 1; 0 <= _ref1 ? _j <= _ref1 : _j >= _ref1; i = 0 <= _ref1 ? ++_j : --_j) {
      console.log("i: " + i);
      encodedMessage = stream.splice(0, MLBC.n);
      console.log("We're decoding: " + encodedMessage.toString());
      decodedBinaryPart = this.decodeMessage(MLBC, [encodedMessage]);
      decodedBinary = decodedBinary.concat(decodedBinaryPart[0]);
      console.log("It decoded to " + decodedBinaryPart.toString());
      console.log("So far we have " + decodedBinary.toString());
    }
    decodedBinary = decodedBinary.slice(0, +(8 * Math.floor(decodedBinary.length / 8) - 1) + 1 || 9e9);
    console.log("Message received: " + this.toStr(decodedBinary));
    return this.toStr(decodedBinary);
  };

  this.encodeLongMessage = function(MLBC, message, stream) {
    var encodedHeader, encodedMessage, encodedSection, header, i, length, messageBin, messages, streamSection, _i, _j, _k, _ref, _ref1, _ref2;

    console.log("The stream is: " + stream.toString());
    messageBin = this.toBin(message);
    while (messageBin.length % MLBC.k !== 0) {
      messageBin.push(0);
    }
    length = messageBin.length / MLBC.k;
    console.log("The encoded message (without header) to be sent is " + length + " chunks long");
    header = this.toBin(length + "`");
    encodedHeader = [];
    for (i = _i = 0, _ref = header.length - 1; 0 <= _ref ? _i <= _ref : _i >= _ref; i = 0 <= _ref ? ++_i : --_i) {
      encodedHeader.push(header[i]);
      encodedHeader.push(header[i]);
      encodedHeader.push(header[i]);
    }
    messageBin = encodedHeader.concat(messageBin);
    console.log("We're gonna encode and transmit: " + messageBin.toString());
    messages = [];
    for (i = _j = 0, _ref1 = messageBin.length / MLBC.k - 1; 0 <= _ref1 ? _j <= _ref1 : _j >= _ref1; i = 0 <= _ref1 ? ++_j : --_j) {
      messages[i] = [];
      messages[i][0] = messageBin.slice(i * MLBC.k, (i * MLBC.k) + MLBC.k);
    }
    encodedMessage = [];
    for (i = _k = 0, _ref2 = messages.length - 1; 0 <= _ref2 ? _k <= _ref2 : _k >= _ref2; i = 0 <= _ref2 ? ++_k : --_k) {
      streamSection = stream.splice(0, MLBC.n);
      encodedSection = this.encodeMessage(MLBC, messages[i], streamSection);
      encodedMessage = encodedMessage.concat(encodedSection);
      console.log("Encoding: " + messages[i][0].toString() + " as " + encodedSection.toString());
    }
    console.log("The total message to be sent is " + encodedMessage.length + " bits long and is " + encodedMessage.toString());
    return encodedMessage;
  };

  this.encodeMessage = function(MLBC, message, stream) {
    var encodedMessage;

    encodedMessage = this.multiplyMatrices(message, MLBC.G1);
    return this.minimizeWetBits(MLBC.G0, [stream], encodedMessage)[0];
  };

  this.getElemsFromArray = function(arr, elems, n) {
    var i, result, _i, _ref;

    elems.reverse();
    result = [];
    for (i = _i = 0, _ref = n - 1; 0 <= _ref ? _i <= _ref : _i >= _ref; i = 0 <= _ref ? ++_i : --_i) {
      result.push(arr[elems.pop()]);
    }
    elems.reverse();
    return result;
  };

  this.decodeMessage = function(MLBC, y) {
    var G1, Ht, Jt, S, column, constraint, constraints, k, n, row, xNew, xNewJt, z, zHammingWeight, _i, _j, _ref, _ref1;

    n = MLBC.n;
    k = MLBC.k;
    G1 = MLBC.G1;
    Ht = MLBC.Ht;
    Jt = MLBC.Jt;
    S = this.multiplyMatrices(y, Ht);
    this.debugOutput("S = yH^t = " + this.matrixString(S));
    constraints = [];
    for (column = _i = 0, _ref = this.width(Ht) - 1; 0 <= _ref ? _i <= _ref : _i >= _ref; column = 0 <= _ref ? ++_i : --_i) {
      constraint = {
        elements: [],
        mustXorTo: S[0][column]
      };
      for (row = _j = 0, _ref1 = this.height(Ht) - 1; 0 <= _ref1 ? _j <= _ref1 : _j >= _ref1; row = 0 <= _ref1 ? ++_j : --_j) {
        if (Ht[row][column] === 1) {
          constraint.elements.push(row);
        }
      }
      constraints.push(constraint);
    }
    z = [this.solveConstraintsMinimally(this.height(Ht), constraints, true, true)];
    zHammingWeight = this.hammingWeight(z);
    this.debugOutput("Errors minimised by z = " + (this.matrixString(z)) + " with hammingWeight " + zHammingWeight);
    xNew = this.addMatrices(y, z);
    this.debugOutput("Attempted to fix errors, xNew = " + this.matrixString(xNew));
    xNewJt = this.multiplyMatrices(xNew, Jt);
    this.debugOutput("Recovered message w' = xNewJt = " + this.matrixString(xNewJt));
    return xNewJt;
  };

  this.testMLBC = function(MLBC, errorRate) {
    var G1, Ht, Jt, errorCount, errors, i, k, n, w, x, xNewJt, y, _i, _j, _ref, _ref1;

    n = MLBC.n;
    k = MLBC.k;
    G1 = MLBC.G1;
    Ht = MLBC.Ht;
    Jt = MLBC.Jt;
    w = this.newRandomMatrix(1, k);
    this.debugOutput("\nNow we encode w = " + this.matrixString(w));
    x = this.encodeMessage(MLBC, w);
    this.debugOutput("x = wG1 = " + this.matrixString(x));
    y = x;
    errorCount = 0;
    for (i = _i = 0, _ref = y[0].length - 1; 0 <= _ref ? _i <= _ref : _i >= _ref; i = 0 <= _ref ? ++_i : --_i) {
      if (Math.random() < errorRate) {
        y[0][i] = (y[0][i] + 1) % 2;
        errorCount++;
      }
    }
    this.debugOutput("Introduced " + errorCount + " errors");
    this.debugOutput("Now make " + this.perc(errorRate) + " errors occur, let y = x + z = " + this.matrixString(y));
    xNewJt = this.decodeMessage(MLBC, y, errorCount);
    errors = 0;
    for (i = _j = 0, _ref1 = this.width(w) - 1; 0 <= _ref1 ? _j <= _ref1 : _j >= _ref1; i = 0 <= _ref1 ? ++_j : --_j) {
      errors += w[0][i] ^ xNewJt[0][i];
    }
    this.debugOutput(errors + " errors occurred");
    return errors;
  };

  this.calculateOfficialRates = function(times) {
    var k, l, n, result, _i, _results;

    result = [];
    _results = [];
    for (n = _i = 5; _i <= 14; n = ++_i) {
      _results.push((function() {
        var _j, _ref, _ref1, _results1;

        _results1 = [];
        for (k = _j = _ref = Math.max(Math.floor(n / 6), 1), _ref1 = Math.round(2 * n / 3) - 2; _ref <= _ref1 ? _j <= _ref1 : _j >= _ref1; k = _ref <= _ref1 ? ++_j : --_j) {
          _results1.push((function() {
            var _k, _ref2, _results2;

            _results2 = [];
            for (l = _k = 1, _ref2 = Math.round(2 * (n - k) / 3) - 1; 1 <= _ref2 ? _k <= _ref2 : _k >= _ref2; l = 1 <= _ref2 ? ++_k : --_k) {
              _results2.push(maxResults(n, k, l, times));
            }
            return _results2;
          })());
        }
        return _results1;
      })());
    }
    return _results;
  };

  this.bestMLBC = function(n, k, l, times) {
    var bestMlbc, i, mlbc, success, t, topScore, u, _i, _ref;

    u = 0;
    t = 0;
    success = false;
    topScore = 0;
    for (i = _i = 0, _ref = times - 1; 0 <= _ref ? _i <= _ref : _i >= _ref; i = 0 <= _ref ? ++_i : --_i) {
      mlbc = this.newMLBC(n, k, l, true);
      success = mlbc.success;
      if (success === true) {
        if ((mlbc.u + mlbc.t) > topScore) {
          topScore = mlbc.u + mlbc.t;
          u = mlbc.u;
          t = mlbc.t;
          bestMlbc = mlbc;
        }
      } else {
        break;
      }
    }
    if (success === true) {
      console.log(n + ", " + k + ", " + l + ": " + this.perc(u / n) + " error rate, " + this.perc(t / n) + " wet bit rate");
    } else {
      console.log("fail");
    }
    return bestMlbc;
  };

  this.testMLBCnTimes = function(config) {
    var abandonRate, attempt, debug, errorRate, errorRateSoFar, errorsExperiencedOnAverage, errorsExperiencedTotal, k, l, mlbc, mlbcAttempts, n, success, tests, _i;

    n = config.n;
    k = config.k;
    l = config.l;
    tests = config.tests;
    errorRate = config.errorRate;
    abandonRate = config.abandonRate;
    debug = config.debug;
    mlbcAttempts = config.mlbcAttempts;
    errorsExperiencedTotal = 0;
    success = true;
    attempt = 0;
    mlbc = this.bestMLBC(n, k, l, mlbcAttempts);
    for (attempt = _i = 1; 1 <= tests ? _i <= tests : _i >= tests; attempt = 1 <= tests ? ++_i : --_i) {
      success = mlbc.success;
      if (!success) {
        break;
      }
      errorsExperiencedTotal += testMLBC(mlbc, errorRate);
      errorsExperiencedOnAverage = errorsExperiencedTotal / attempt;
      errorRateSoFar = errorsExperiencedOnAverage / k;
      if (debug === true) {
        console.log(this.perc(attempt / tests) + " complete. " + this.perc(errorRateSoFar) + " error rate");
      }
      if (errorRateSoFar > abandonRate) {
        success = false;
        break;
      }
    }
    if (success) {
      errorsExperiencedOnAverage = errorsExperiencedTotal / tests;
      return console.log(n + ", " + k + ", " + l + ": " + this.perc(errorsExperiencedOnAverage / k) + " error rate when experiencing " + this.perc(errorRate) + " errors. Transmission rate: " + this.perc(k / n));
    }
  };

  this.testRates = function(config) {
    var abandonRate, errorRate, k, l, n, result, tests, _i, _results;

    tests = config.tests;
    errorRate = config.errorRate;
    abandonRate = config.abandonRate;
    result = [];
    _results = [];
    for (n = _i = 10; _i <= 30; n = ++_i) {
      console.log("Now working on n = " + n);
      _results.push((function() {
        var _j, _ref, _results1;

        _results1 = [];
        for (k = _j = 1, _ref = Math.round(n / 2) - 2; 1 <= _ref ? _j <= _ref : _j >= _ref; k = 1 <= _ref ? ++_j : --_j) {
          _results1.push((function() {
            var _k, _ref1, _ref2, _results2;

            _results2 = [];
            for (l = _k = _ref1 = Math.max(Math.floor(n / 10), 1), _ref2 = Math.round((n - k) / 4) - 1; _ref1 <= _ref2 ? _k <= _ref2 : _k >= _ref2; l = _ref1 <= _ref2 ? ++_k : --_k) {
              _results2.push(testMLBCnTimes({
                n: n,
                k: k,
                l: l,
                tests: tests,
                errorRate: errorRate,
                abandonRate: abandonRate,
                debug: false
              }));
            }
            return _results2;
          })());
        }
        return _results1;
      })());
    }
    return _results;
  };

  this.decPlaces = function(number, places) {
    return Math.round(number * Math.pow(10, places)) / Math.pow(10, places);
  };

  this.perc = function(number) {
    return Math.round(number * 10000) / 100 + "%";
  };

  this.debugOutput = function(m) {
    if (this.debug) {
      return console.log(m);
    }
  };

  return this;
})();