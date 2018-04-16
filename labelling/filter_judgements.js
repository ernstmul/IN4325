function loadJSON(callback) {
    
        var xobj = new XMLHttpRequest();
        xobj.overrideMimeType("application/json");
        xobj.open('GET', 'judgementResults.json', true);
        xobj.onreadystatechange = function() {
            if (xobj.readyState == 4 && xobj.status == "200") {
                // .open will NOT return a value but simply returns undefined in async mode so use a callback
                callback(xobj.responseText);
    
            }
        }
        xobj.send(null);   
    }

function findDuplicateJudgementsIndividual(data, print) {
    var map = new Map();
    var res = [];

    data.forEach(element => {
        var d = map.get(element.imageId);
        if (d) {
            d.push(element);
        } else {
            map.set(element.imageId, [element])
        }
    });

    for (var [key, value] of map.entries()) {
        if (value.length != 1 && print) {
            console.log("Not 1 judgements for image id " + key + " but " + value.length);
        }
        res.push(value[Math.floor(Math.random() * value.length)]);
    }

    return res;
}

loadJSON((content) => {
    var data = JSON.parse(content);

    var documentDivisionIDs = {
        refineOverlapIDs: [208, 884, 512, 483, 10, 180, 838, 457, 186, 764, 525, 527, 734, 106, 81, 191, 824, 881, 168, 157, 467, 398, 257, 556, 705, 330, 238, 618, 195, 460, 514, 328, 385, 134, 871, 722, 309, 452, 317, 3, 403, 120, 629, 96, 718, 563, 792, 778, 209, 832, 67, 242, 517, 33, 175, 844, 404, 347, 428, 378, 531, 444, 291, 890, 251, 366, 532, 542, 651, 580, 885, 339, 869, 486, 413, 616, 717, 308, 633, 591, 323, 627, 408, 52, 151, 223, 235, 470, 265, 481, 537, 296, 91, 659, 353, 327, 653, 364, 373, 462],
        labelOverlapIDs: [721, 574, 835, 115, 247, 199, 95, 842, 896, 340, 570, 64, 725, 293, 206, 652, 671, 302, 207, 744, 228, 1, 135, 351, 886, 58, 278, 634, 152, 708, 526, 807, 198, 227, 529, 491, 196, 426, 15, 761, 269, 344, 638, 793, 61, 752, 416, 216, 117, 455, 2, 298, 17, 482, 250, 547, 145, 285, 16, 472, 357, 155, 688, 20, 783, 768, 412, 487, 687, 97, 624, 577, 141, 603, 422, 241, 125, 222, 716, 176, 795, 583, 9, 829, 465, 644, 12, 409, 119, 861, 767, 86, 271, 540, 576, 53, 660, 187, 706, 65, 188, 685, 147, 775, 18, 284, 55, 103, 743, 691, 848, 641, 171, 692, 464, 546, 478, 727, 567, 690, 41, 697, 615, 870, 89, 5, 565, 504, 674, 314, 461, 280, 867, 506, 730, 131, 879, 757, 693, 619, 110, 821, 361, 19, 856, 77, 762, 469, 70, 343, 260, 94, 699, 406, 336, 891, 630, 253, 571, 255, 553, 437, 631, 445, 345, 310, 275, 397, 201, 811, 601, 268, 375, 46, 759, 331, 621, 683, 329, 126, 732, 865, 850, 254, 544, 575, 166, 548, 137, 36, 57, 354, 23, 75, 193, 530, 804, 834, 60, 360],
        remcoIDs: [132, 606, 892, 35, 678, 225, 277, 290, 658, 787, 32, 213, 263, 424, 675, 893, 878, 170, 612, 748, 379, 523, 707, 803, 876, 806, 90, 401, 382, 177, 181, 165, 579, 381, 632, 429, 449, 305, 883, 670, 755, 875, 44, 620, 459, 880, 144, 158, 471, 789, 286, 684, 246, 68, 573, 258, 376, 782, 414, 69, 295, 430, 602, 440, 348, 369, 24, 129, 714, 846, 731, 418, 585, 185, 646, 597, 92, 741, 183, 698, 647, 543, 489, 827, 589, 178, 245, 763, 828, 43, 635, 322, 847, 109, 552, 622, 496, 38, 747, 474, 539, 122, 365, 837, 663, 746, 497, 324, 399, 442, 604, 788, 259, 197, 594, 371, 737, 432, 146, 776, 439, 78, 559, 780, 495, 402, 374, 756, 156, 712, 822, 88, 765, 501, 636, 679, 568, 337, 866, 435, 194, 63, 648, 456, 753, 882, 394, 27, 54, 390, 111, 282, 610, 611, 407, 484, 609, 149, 433, 802, 887, 657, 572, 519, 205, 396, 669, 212, 318, 59, 587, 654, 450, 779, 830, 735, 388, 823, 13, 586, 816, 210, 299, 39, 4, 711, 672, 664, 510, 11, 320, 333, 372, 738, 694, 855, 153, 316, 656, 791, 138, 79, 164, 355, 889, 613, 356, 509, 797, 784, 551, 105, 133, 182, 581, 270, 643, 233, 592, 410, 391, 169, 237, 335, 774, 127, 26, 66, 701, 541, 100, 729, 564, 266, 49, 535, 513, 680, 796, 192, 7, 493, 368, 303, 383, 451, 897, 292, 477, 159, 772, 352, 256, 516, 818, 350, 243, 22, 173, 161, 74, 740, 231, 417, 521, 423, 283, 751, 217, 219, 76, 507, 808, 545, 590, 85, 785, 160, 595, 549, 99, 287, 393, 702, 505, 274, 815, 668, 637, 665, 400, 626, 84, 367, 492, 550, 845, 321, 511],
        ernstIDs: [415, 204, 93, 522, 888, 252, 812, 453, 130, 101, 703, 289, 724, 700, 338, 276, 315, 877, 677, 104, 421, 189, 719, 801, 118, 107, 128, 562, 860, 773, 312, 248, 446, 758, 558, 108, 628, 894, 174, 82, 518, 98, 745, 34, 749, 395, 831, 80, 142, 498, 6, 810, 781, 798, 172, 524, 325, 825, 617, 436, 895, 534, 476, 301, 566, 713, 31, 500, 723, 605, 739, 273, 600, 387, 203, 434, 686, 508, 431, 313, 786, 584, 468, 853, 162, 480, 448, 814, 726, 502, 607, 30, 167, 536, 662, 673, 473, 582, 864, 499, 557, 332, 184, 427, 841, 560, 709, 681, 503, 264, 857, 554, 800, 28, 852, 715, 116, 840, 47, 294, 40, 777, 799, 363, 488, 769, 48, 114, 37, 854, 102, 447, 809, 411, 72, 754, 438, 300, 872, 868, 843, 261, 639, 150, 598, 380, 319, 50, 267, 720, 358, 682, 202, 249, 139, 874, 179, 218, 163, 123, 770, 342, 826, 405, 833, 211, 230, 234, 346, 766, 661, 555, 760, 307, 441, 121, 642, 695, 533, 143, 443, 494, 281, 154, 349, 750, 113, 790, 588, 849, 326, 148, 262, 419, 62, 56, 232, 87, 341, 384, 311, 200, 224, 676, 377, 244, 240, 839, 515, 140, 359, 221, 215, 623, 214, 454, 608, 733, 596, 458, 389, 813, 136, 819, 425, 625, 42, 239, 51, 83, 649, 538, 25, 728, 689, 569, 226, 820, 220, 859, 862, 851, 485, 667, 640, 190, 306, 490, 236, 863, 297, 45, 528, 794, 112, 392, 696, 124, 593, 858, 873, 304, 288, 614, 479, 578, 362, 645, 599, 334, 655, 805, 475, 836, 736, 272, 742, 817, 561, 73, 21, 229, 463, 8, 466, 704, 71, 370, 29, 710, 650, 14, 666, 520, 386, 420, 279, 771]
    }

    console.log("Filtering for duplicates for overlap");
    var overlapIDs = documentDivisionIDs.refineOverlapIDs.concat(documentDivisionIDs.labelOverlapIDs);

    var overlap = data.filter((element) => {
        return overlapIDs.indexOf(element.imageId) > -1;
    });

    var map = new Map();

    overlap.forEach(judgement => {
        var d = map.get(judgement.imageId);
        if (d) {
            d.push(judgement);
        } else {
            map.set(judgement.imageId, [judgement]);
        }
    });

    for (var [key, value] of map.entries()) {
        if (value.length != 2) {
            var ernst = value.filter(element => element.judger == "ernst");
            var remco = value.filter(element => element.judger == "remco");
            console.log("Overlap: not 2 judgements for image id " + key + " but " + value.length + "," + ernst.length + "," + remco.length);
            map.set(key, [remco[Math.floor(Math.random() * remco.length)], ernst[Math.floor(Math.random() * ernst.length)]]);
        }
    }

    var overlapFiltered = [];
    for (var [key, value] of map.entries()) {
        overlapFiltered = overlapFiltered.concat(value);
    }

    console.log("Filtering for duplicates for individuals");
    var remco = data.filter(element => {
        return documentDivisionIDs.remcoIDs.indexOf(element.imageId) > -1;
    });
    var ernst = data.filter(element => {
        return documentDivisionIDs.ernstIDs.indexOf(element.imageId) > -1;
    });

    console.log("Filtering duplicates remco");
    var remcoFiltered = findDuplicateJudgementsIndividual(remco, true);
    console.log("Filtering duplicates ernst");
    var ernstFiltered = findDuplicateJudgementsIndividual(ernst, true);

    console.log("");
    
    console.log(JSON.stringify(remcoFiltered.concat(ernstFiltered).concat(overlapFiltered)));
    console.log(remcoFiltered.concat(ernstFiltered).concat(overlapFiltered).length)
    console.log(remcoFiltered.length);
    console.log(ernstFiltered.length);
    console.log(overlapFiltered.length);

    var dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(remcoFiltered.concat(ernstFiltered).concat(overlapFiltered)));
    var dlAnchorElem = document.getElementById('downloadAnchorElem');
    dlAnchorElem.setAttribute("href",     dataStr     );
    dlAnchorElem.setAttribute("download", "scene.json");
    dlAnchorElem.click();
});