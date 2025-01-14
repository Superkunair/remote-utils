const fs = require('fs');

const args = process.argv;
const severities = process.env.SEVERITY_LIST || ['CRITICAL','HIGH'];

if(!args[2]){
    console.error('Dependency file required');
    return process.exit(1);
}

if(!args[3]){
    console.error('Output file required');
    return process.exit(1);
}


const getVulnerabilities = (dependenciesObject) => {
    const deps = dependenciesObject.dependencies;
    const project = dependenciesObject.projectInfo.name;
    return deps.map(dep => {
        if(dep.vulnerabilities) return dep.vulnerabilities
    }).filter(el => el !== undefined).flat().map(item => ({...item, project}))
      .filter(vul => severities.includes(vul.severity));    
}

fs.readFile(args[2],(err, data) => {
    if(err) return process.exit(1);
    const rawData = JSON.parse(data);
    console.info(`Filtering ${rawData.dependencies.length} elements...`);
    const filteredData = getVulnerabilities(rawData);
    if(filteredData.length < 1) return process.exit(0);
    console.info('Writting data...')
    fs.writeFileSync(`./${args[3]}`, JSON.stringify(filteredData));
    console.log(`Filter done your file is: ${args[3]}`);
})
