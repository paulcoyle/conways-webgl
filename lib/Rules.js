module.exports = {
  ruleSets: [ createRule('Conway\'s Life', [2, 3], [3])
            , createRule('Mazectric', [1, 2, 3, 4], [3])
            , createRule('Maze', [1, 2, 3, 4, 5], [3])
            , createRule('Serviettes', [], [2, 3, 4])
            , createRule('DotLife', [0, 2, 3], [3])
            , createRule('Coral', [4, 5, 6, 7, 8], [3])
            , createRule('34 Life', [3, 4], [3, 4])
            , createRule('Assimilation', [4, 5, 6, 7], [3, 4, 5])
            , createRule('Long Life', [5], [3, 4, 5])
            , createRule('Diamoeba', [5, 6, 7, 8], [3, 5, 6, 7, 8])
            , createRule('Amoeba', [1, 3, 5, 8], [3, 5, 7])
            , createRule('Pseudo Life', [2, 3, 8], [3, 5, 7])
            , createRule('2x2', [1, 2, 5], [3, 6])
            , createRule('HighLife', [2, 3], [3, 6])
            , createRule('Move', [2, 4, 5], [3, 6, 8])
            , createRule('Stains', [2, 3, 5, 6, 7, 8], [3, 6, 7, 8])
            , createRule('Day & Night', [3, 4, 6, 7, 8], [3, 6, 7, 8])
            , createRule('DryLife', [2, 3], [3, 7])
            , createRule('Coagulations', [2, 3, 5, 6, 7, 8], [3, 7, 8])
            , createRule('Walled Cities', [2, 3, 4, 5], [4, 5, 6, 7, 8])
            , createRule('Vote 4/5', [3, 5, 6, 7, 8], [4, 6, 7, 8])
            , createRule('Vote', [4, 5, 6, 7, 8], [5, 6, 7, 8])
            ]
};

function createRule(label, birth, death) {
  return {
    label: label,
    birth: birth,
    death: death
  };
}
