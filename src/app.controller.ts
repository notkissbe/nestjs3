import { Controller, Delete, Get, Param, Query, Render } from '@nestjs/common';
import { AppService } from './app.service';
import { quotes } from './quotes';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) { }

  @Get()
  @Render('index')
  getHello() {
    return {
      message: this.appService.getHello()
    };
  }

  @Get('quotes')
  @Render('quotes')
  quotes() {
    return{
      message: quotes.quotes
    }
  }

  @Get('randomQuote')
  @Render('rndQuot')
  randomQuote(){
  const randInt = Math.floor(Math.random()*quotes.quotes.length) +1

  return{
    message: quotes.quotes[randInt]
  }
  }

  @Get('topAuthors')
  @Render('quotesranked')
  topAuthors(){
    let map = new Map()
    
    quotes.quotes.forEach(element => {
      if (map.has(element.author)) {
        let prevvalue = map.get(element.author);
        map.set(element.author, prevvalue += 1);
      }
      else{
        map.set(element.author, 1)
      }
    });
    return {
      message:new Map([...map.entries()].sort((a, b) => b[1] - a[1]))

    }
  }

  @Get('quotes/:id')
  @Render("index")
  oneQuote(@Param('id') id: string) {
    const quote = quotes.quotes.find(q => q.id.toString() === id);
    
    if (!quote) {
      return { message: 'Quote not found' };
    }
    return { message: quote.quote };
  }

  @Get("deleteQuote/:id")
  @Render("index")
  @Delete("deleteQuote/:id")
    deleteQuote(@Param('id') id: string) {
      const quoteIndex = quotes.quotes.findIndex(q => q.id.toString() === id);

      if (quoteIndex === -1) {
        return { message: 'Quote not found' };
      }
      const deletedQuote = quotes.quotes.splice(quoteIndex, 1);

      return { message: `Quote '${deletedQuote[0].quote}' has been deleted.` };
    }

    @Get("search")
    @Render("search")
    search(@Query('searchTerm') searchTerm : string) 
      {
        //osszes quote a szerzotol
        let quotesfromauthor = [];
        quotes.quotes.forEach(element => {
          if (element.quote.includes(searchTerm)) {
            quotesfromauthor.push(element.quote)
          }
        });
        if (quotesfromauthor.length == 0) {
          return {message:["nincs ilyen uzent"]}
        }
        else{
          return {message:quotesfromauthor}
        }

      }

    @Get("authorRandomForm")
    @Render("autRandForm")
    autRandForm(@Query('author') author : string) 
      {
        
        //osszes quote a szerzotol
        let qoutesfromauthor = new Array;
        quotes.quotes.forEach(element => {
          if (element.author == author) {
            qoutesfromauthor.push(element.quote)
          }
        });
        const randInt = Math.floor(Math.random()*qoutesfromauthor.length) 

        return {message:qoutesfromauthor[randInt]}
      }
    
    @Get("highlight/:id")
    @Render("index")
    highlight(@Query('SZOVEGRESZLET') SZOVEGRESZLET : string,@Param('id') id: string){
      let qoutesfromauthor = new Array;
      let idl = parseInt(id)
        quotes.quotes.forEach(element => {
          if (element.id == idl) {
            qoutesfromauthor.push(element.quote)
          }
        });
        const randInt = Math.floor(Math.random()*qoutesfromauthor.length) 
        const regex = new RegExp(`(${SZOVEGRESZLET})`, 'gi');
        return {message:qoutesfromauthor[0].replace(regex, '<strong>$1</strong>')}
        return {message:qoutesfromauthor}
    }


  
}
