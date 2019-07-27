$(document).ready(function () {
    sn.retrieveBM(getUrlParameter('id'));

    $('#modelAdd').click(function () {
        var index = $('#model tr').length;
        var modelElement = "<tr id='" + index + "'>";
        modelElement += "<td><input type='text' class='form-control model' placeholder='Enter new Model''><td>";
        modelElement += "<td><center><a onclick='deleteModel(" + index + ")' class='btn btn-default'>Remove</a></center></td>";
        modelElement += "</tr>";
        $("#model").append(modelElement);
    });

    $("#updateBMForm").submit(function (e) {
        e.preventDefault();
        var id = getUrlParameter('id');

        if (id === undefined || id.trim().length === 0) {
            location.replace("BM.jsp");
            return;
        }

        var brand = $("#brand").val();
        var models = "";
        var modelsArr = [];
        $('.model').each(function (index, item) {
            console.log($(item).val());
            modelsArr.push($(item).val().trim());
        });
        modelsArr.sort();
        models = modelsArr.join("~");
        
        sn.updateBM(id, brand, models);
    });
});

function deleteModel(index) {
    var id = getUrlParameter('id');
    sn.deleteModel(id, index);
}